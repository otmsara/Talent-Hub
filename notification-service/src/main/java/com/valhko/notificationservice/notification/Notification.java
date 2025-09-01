package com.valhko.notificationservice.notification;

import com.valhko.common.event.notification.NotificationEvent;
import com.valhko.common.event.notification.NotificationEventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private NotificationEventType notificationType;
    private String message;
    private String sourceId;
    private String targetId;
    private boolean read = false;
    private boolean seen = false;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;


    public static Notification from(NotificationEvent event) {
        var notification = new Notification();
        notification.setNotificationType(event.getEventType());
        notification.setSourceId(event.getSourceId());
        notification.setTargetId(event.getTargetId());
        return notification;
    }
}
