package com.valhko.userservice.badgerequest;

import com.valhko.userservice.badge.util.BadgeType;
import com.valhko.userservice.badgerequest.util.BadgeRequestStatus;
import com.valhko.userservice.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BadgeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private BadgeType type;
    @ManyToOne(fetch = FetchType.EAGER)
    private User requester;
    @Column(columnDefinition = "TEXT")
    private String content;
    @ElementCollection
    @Builder.Default
    private List<String> attachmentsIds = new ArrayList<>();
    @Builder.Default
    private BadgeRequestStatus status = BadgeRequestStatus.PENDING;
    private LocalDate validUntil;
    private boolean done;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
