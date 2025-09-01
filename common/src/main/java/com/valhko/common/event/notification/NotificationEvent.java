package com.valhko.common.event.notification;

import com.valhko.common.event.base.DomainEvent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements DomainEvent<NotificationEventType> {
    private String id;
    private NotificationEventType eventType;
    private String sourceId;
    private String targetId;


    @Override
    public String getAggregateId() {
        return id;
    }

    @Override
    public NotificationEventType getEventType() {
        return eventType;
    }

    @Override
    public LocalDateTime getTimestamp() {
        return LocalDateTime.now();
    }

    @Override
    public String getAggregateType() {
        return "Notification";
    }

    @Override
    public int getVersion() {
        return 1;
    }

    @Override
    public String getTopic() {
        return "notification-events";
    }
}
