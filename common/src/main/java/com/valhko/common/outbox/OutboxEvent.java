package com.valhko.common.outbox;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ConditionalOnProperty(prefix = "common.outbox-event", name = "enabled", havingValue = "true")
public class OutboxEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String eventId;

    @Column(nullable = false, length = 100)
    private String aggregateType; // e.g., "User"

    @Column(nullable = false)
    private String aggregateId;   // e.g., userId (String)

    @Column(nullable = false, length = 100)
    private String eventType;     // e.g., "USER_CREATED", "USER_UPDATED"

    @Column(nullable = false)
    private int version;

    @Column(nullable = false)
    private String topic;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Builder.Default
    @Column(nullable = false)
    private boolean delivered = false;

    @CreationTimestamp
    private LocalDateTime timestamp;
}