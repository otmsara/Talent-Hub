package com.valhko.chatservice.conversation;

import com.valhko.chatservice.conversation.util.ConversationType;
import com.valhko.common.client.userservice.UserServiceClient;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.dto.response.Result;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.util.StatusCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepo repo;
    private final UserServiceClient userClient;

    @Override
    public Conversation create(Conversation item) {
        if (item.getType() == ConversationType.PRIVATE) {
            if (item.getMembers().size() > 2)
                throw new InvalidArgumentsException("You can't more than 2 members in a private conversation.");

            int userIdCountInList = item.getMembers()
                    .stream().filter(e -> e.getUserId().equals(UserContextHolder.userId())).toList().size();
            if (userIdCountInList == 0)
                throw new InvalidArgumentsException("You have to be in the conversation.");

            var otherMember = item.getMembers()
                    .stream().filter(e -> !e.getUserId().equals(UserContextHolder.userId())).toList().getFirst();

            Result<UserInternalDto> dtoResult = userClient.findById(otherMember.getUserId());

            if (!dtoResult.isFlag()) {
                if (dtoResult.getCode() == StatusCode.NOT_FOUND)
                    throw new InvalidArgumentsException(String.format("User with id %s doesn't exists", otherMember.getUserId()));
                else
                    throw new RuntimeException(dtoResult.getMessage());
            }

            var userIds = new HashSet<String>();
            userIds.add(UserContextHolder.userId());
            userIds.add(otherMember.getUserId());

            // TODO: Update later
            //if (repo.existsByMembersUserIdInAndType(userIds, ConversationType.PRIVATE))
             //   throw new InvalidArgumentsException("You already have a conversation with this user");

            item.getMembers().forEach(e -> e.setConversation(item));
        } else {
            throw new InvalidArgumentsException("Only private conversations are available for now.");
        }

        return repo.save(item);
    }

    @Override
    public Conversation findByRecipientId(String recipientId) {
        var users = new HashSet<String>();
        users.add(UserContextHolder.userId());
        users.add(recipientId);


        return repo.findByMembersUserIdInAndType(users, ConversationType.PRIVATE);
    }

    @Override
    public Page<Conversation> findByUserId(Pageable pageable) {
        return repo.findByMembersUserId(UserContextHolder.userId(), pageable);
    }
}
