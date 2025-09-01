package com.valhko.chatservice.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

public interface MessageService {
    Page<Message> findByConversationId(String conversationId, Pageable pageable);

    Message create(Message item);

    Message update(String id, Message item);

    void delete(String id);

    Long getUnreadMessagesCount();

    Map<String, Long> getUnreadMessagesCountByConversation();

    void markMessageAsRead(String messageId);

    void markConversationAsRead(String conversationId);
}
