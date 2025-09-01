package com.valhko.chatservice.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface MessageRepo extends JpaRepository<Message, String> {
    Page<Message> findByConversationId(String conversationId, Pageable pageable);

    @Query("SELECT '*' FROM Message WHERE conversation.id = :conversationId ORDER BY createdAt DESC LIMIT 1")
    Message getConversationLastMessage(String conversationId);

    @Query("""
    SELECT m FROM Message m 
    WHERE m.conversation.id IN :conversationIds 
    AND m.id IN (
        SELECT m2.id FROM Message m2 
        WHERE m2.conversation.id = m.conversation.id 
        AND m2.createdAt = (
            SELECT MAX(m3.createdAt) 
            FROM Message m3 
            WHERE m3.conversation.id = m2.conversation.id
        )
    )
    ORDER BY m.createdAt DESC
    """)
    List<Message> getConversationsLastMessage(@Param("conversationIds") Set<String> conversationIds);

    @Query("SELECT COUNT(m) FROM Message m " +
            "JOIN m.conversation c " +
            "JOIN c.members mem " +
            "WHERE mem.userId = :userId " +
            "AND m.sender.userId != :userId " +
            "AND m.deleted = false " +
            "AND NOT EXISTS (SELECT 1 FROM MessageReadStatus mrs WHERE mrs.message = m AND mrs.userId = :userId)")
    Long countUnreadMessagesForUser(@Param("userId") String userId);

    @Query("SELECT c.id, COUNT(m) FROM Message m " +
            "JOIN m.conversation c " +
            "JOIN c.members mem " +
            "WHERE mem.userId = :userId " +
            "AND m.sender.userId != :userId " +
            "AND m.deleted = false " +
            "AND NOT EXISTS (SELECT 1 FROM MessageReadStatus mrs WHERE mrs.message = m AND mrs.userId = :userId) " +
            "GROUP BY c.id")
    List<Object[]> countUnreadMessagesByConversationForUser(@Param("userId") String userId);

    @Query("SELECT m FROM Message m " +
            "JOIN m.conversation c " +
            "JOIN c.members mem " +
            "WHERE mem.userId = :userId " +
            "AND m.sender.userId != :userId " +
            "AND m.deleted = false " +
            "AND NOT EXISTS (SELECT 1 FROM MessageReadStatus mrs WHERE mrs.message = m AND mrs.userId = :userId) " +
            "ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesForUser(@Param("userId") String userId);
}
