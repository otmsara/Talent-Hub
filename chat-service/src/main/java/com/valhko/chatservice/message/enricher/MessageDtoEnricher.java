package com.valhko.chatservice.message.enricher;

import com.valhko.chatservice.message.Message;
import com.valhko.chatservice.message.MessageReadStatus;
import com.valhko.chatservice.message.MessageReadStatusRepo;
import com.valhko.chatservice.message.dto.response.MessageDto;
import com.valhko.common.system.config.UserContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MessageDtoEnricher {
    private final MessageReadStatusRepo messageReadStatusRepo;

    public void enrich(Message entity, MessageDto dto) {
        boolean isRead = messageReadStatusRepo.existsByUserIdAndMessage(UserContextHolder.userId(), entity);
        dto.setRead(isRead);
    }

    public void enrich(Page<Message> entities, Page<MessageDto> dtoList) {
        Map<String, Boolean> map = getReadStatusMap(UserContextHolder.userId(), entities.map(Message::getId).toList());

        dtoList.forEach(e -> {
            e.setRead(map.get(e.getId()));
        });

    }

    private Set<String> getReadMessageIds(String userId, Set<String> messageIds) {
        List<MessageReadStatus> readStatuses = messageReadStatusRepo
                .findByUserIdAndMessageIdIn(userId, messageIds);

        return readStatuses.stream()
                .map(mrs -> mrs.getMessage().getId())
                .collect(Collectors.toSet());
    }

    public Map<String, Boolean> getReadStatusMap(String userId, List<String> messageIds) {
        Set<String> messageIdSet = new HashSet<>(messageIds);
        Set<String> readMessageIds = getReadMessageIds(userId, messageIdSet);

        return messageIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        readMessageIds::contains
                ));
    }

}
