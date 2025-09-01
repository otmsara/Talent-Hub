package com.valhko.chatservice.message;

import com.valhko.chatservice.conversation.Conversation;
import com.valhko.chatservice.member.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    private Member sender;
    private String message;
    @ManyToOne
    private Conversation conversation;
    @OneToMany(mappedBy = "message")
    private List<MessageReadStatus> readers;
    private String media;
    private boolean deleted = false;
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
