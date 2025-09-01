package com.valhko.chatservice.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface MessageReadStatusRepo extends JpaRepository<MessageReadStatus, String> {
    boolean existsByUserIdAndMessage(String userId, Message message);

    List<MessageReadStatus> findByUserIdAndMessageIdIn(String userId, Set<String> ids);

    List<MessageReadStatus> findByUserId(String userId);

    List<MessageReadStatus> findByMessage(Message message);
    List<MessageReadStatus> findByMessageIdIn(List<String> ids);

    @Query("SELECT mrs FROM MessageReadStatus mrs WHERE mrs.userId = :userId AND mrs.message.id = :messageId")
    Optional<MessageReadStatus> findByUserIdAndMessageId(@Param("userId") String userId, @Param("messageId") String messageId);
}
