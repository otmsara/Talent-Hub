package com.valhko.chatservice.member;

import com.valhko.chatservice.conversation.Conversation;
import com.valhko.chatservice.member.util.MemberRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(indexes = {@Index(columnList = "userId")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String userId;
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;
    @ManyToOne
    private Conversation conversation;
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
