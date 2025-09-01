package com.valhko.chatservice.message;

import com.valhko.chatservice.conversation.Conversation;
import com.valhko.chatservice.conversation.ConversationRepo;
import com.valhko.chatservice.conversation.util.ConversationType;
import com.valhko.chatservice.member.Member;
import com.valhko.chatservice.member.MemberRepo;
import com.valhko.chatservice.message.converter.MessageConverter;
import com.valhko.chatservice.message.dto.response.MessageDto;
import com.valhko.chatservice.message.enricher.MessageDtoEnricher;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepo repo;
    private final MemberRepo memberRepo;
    private final ConversationRepo conversationRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageConverter messageConverter;
    private final MessageReadStatusRepo messageReadStatusRepo;
    private final MessageDtoEnricher enricher;

    @Override
    public Page<Message> findByConversationId(String conversationId, Pageable pageable) {
        Conversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new InvalidArgumentsException("The conversation doesn't exists"));

        if (conversation.getMembers().stream().noneMatch(e -> e.getUserId().equals(UserContextHolder.userId())))
            throw new ForbiddenRequestException("You can't read messages of this conversation");

        return repo.findByConversationId(conversationId, pageable);
    }

    @Override
    public Message create(Message item) {
        Conversation conversation = conversationRepo.findById(item.getConversation().getId())
                .orElseThrow(() -> new InvalidArgumentsException("The conversation was not found."));

        var senderMember = conversation.getMembers().stream().filter(e -> e.getUserId().equals(UserContextHolder.userId()))
                .findFirst()
                .orElseThrow(() -> new InvalidArgumentsException("The member was not found."));

        item.setSender(senderMember);
        item.setConversation(conversation);

        Message saved = repo.save(item);

        var otherUser = saved.getConversation().getMembers().stream().filter(e -> !e.getUserId().equals(UserContextHolder.userId())).findFirst().orElse(null);

        sendMessageTo(saved, otherUser.getUserId());

        return saved;
    }

    @Override
    public Message update(String id, Message item) {
        var message = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The message was not found."));

        if (!message.getSender().getUserId().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You can't update a message you don't own");

        if (StringUtils.hasLength(item.getMessage()))
            message.setMessage(item.getMessage());

        if (item.getMedia() != null)
            message.setMedia(item.getMedia());

        var updated = repo.save(message);

        var otherUser = updated.getConversation().getMembers().stream().filter(e -> !e.getUserId().equals(UserContextHolder.userId())).findFirst().orElse(null);

        sendMessageTo(updated, otherUser.getUserId());

        return updated;
    }

    @Override
    public void delete(String id) {
        var message = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The message was not found."));

        if (!message.getSender().getUserId().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You can't delete a message you don't own");

        message.setDeleted(true);

        var updated = repo.save(message);

        var otherUser = updated.getConversation().getMembers().stream().filter(e -> !e.getUserId().equals(UserContextHolder.userId())).findFirst().orElse(null);

        sendMessageTo(updated, otherUser.getUserId());
    }

    @Override
    public Long getUnreadMessagesCount() {
        return repo.countUnreadMessagesForUser(UserContextHolder.userId());
    }

    @Override
    public Map<String, Long> getUnreadMessagesCountByConversation() {
        List<Object[]> results = repo.countUnreadMessagesByConversationForUser(UserContextHolder.userId());
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));
    }

    public List<Message> getUnreadMessages(String userId) {
        return repo.findUnreadMessagesForUser(userId);
    }

    @Override
    public void markMessageAsRead(String messageId) {
        // Check if already marked as read
        String userId = UserContextHolder.userId();
        Optional<MessageReadStatus> existing = messageReadStatusRepo
                .findByUserIdAndMessageId(userId, messageId);

        if (existing.isEmpty()) {
            Message message = repo.findById(messageId)
                    .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

            MessageReadStatus readStatus = MessageReadStatus.builder()
                    .userId(userId)
                    .message(message)
                    .build();

            messageReadStatusRepo.save(readStatus);
            message = repo.findById(messageId).orElseThrow(() -> new ResourceNotFoundException("Message not found"));
            sendMessageTo(message, message.getSender().getUserId());
        }
    }

    @Override
    @Transactional
    public void markConversationAsRead(String conversationId) {
        String userId = UserContextHolder.userId();
        List<Message> unreadMessages = repo.findUnreadMessagesForUser(userId)
                .stream()
                .filter(message -> message.getConversation().getId().equals(conversationId))
                .toList();

        List<MessageReadStatus> readStatuses = unreadMessages.stream()
                .map(message -> MessageReadStatus.builder()
                        .userId(userId)
                        .message(message)
                        .build())
                .collect(Collectors.toList());

        messageReadStatusRepo.saveAll(readStatuses);

    }

    private void sendMessageTo(Message message, String userId) {
        if (ConversationType.PRIVATE.equals(message.getConversation().getType())) {

            MessageDto dto = messageConverter.convertForMessage(message);
            enricher.enrich(message, dto);
            messagingTemplate.convertAndSendToUser(userId, "/queue/messages", dto);
        }
    }
}
