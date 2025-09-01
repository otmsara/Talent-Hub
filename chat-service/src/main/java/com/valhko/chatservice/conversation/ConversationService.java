package com.valhko.chatservice.conversation;

import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConversationService {
    Conversation create(Conversation item);

    Conversation findByRecipientId(String recipientId);

    Page<Conversation> findByUserId(Pageable pageable);
}
