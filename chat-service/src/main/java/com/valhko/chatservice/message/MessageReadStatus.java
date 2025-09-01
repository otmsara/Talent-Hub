package com.valhko.chatservice.message;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.valhko.chatservice.member.util.MemberRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        indexes = {
                @Index(columnList = "userId"),
                @Index(columnList = "messageId"),
                @Index(columnList = "userId,messageId", unique = true)
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class MessageReadStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;

    @ManyToOne
    @JoinColumn(name = "messageId")
    @JsonIgnore
    private Message message;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime readAt;
}