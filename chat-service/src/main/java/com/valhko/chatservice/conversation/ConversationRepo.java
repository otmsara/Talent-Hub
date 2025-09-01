package com.valhko.chatservice.conversation;

import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.conversation.util.ConversationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface ConversationRepo extends JpaRepository<Conversation, String> {
    Conversation findByMembersUserIdInAndType(Set<String> userIds, ConversationType type);

    boolean existsByMembersUserIdInAndType(Set<String> userIds, ConversationType type);

    Page<Conversation> findByMembersUserId(String memberUserId, Pageable pageable);
}
