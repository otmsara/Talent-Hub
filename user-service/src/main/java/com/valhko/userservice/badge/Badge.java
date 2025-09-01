package com.valhko.userservice.badge;

import com.valhko.userservice.badge.util.BadgeStatus;
import com.valhko.userservice.badge.util.BadgeType;
import com.valhko.userservice.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private BadgeType type;
    @Builder.Default
    private BadgeStatus status = BadgeStatus.INACTIVE;
    @ManyToOne
    private User owner;
    private LocalDate validUntil;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
