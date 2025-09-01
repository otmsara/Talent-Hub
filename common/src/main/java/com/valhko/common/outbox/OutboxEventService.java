package com.valhko.common.outbox;


import com.valhko.common.event.base.DomainEvent;
import com.valhko.common.event.notification.NotificationEventType;

public interface OutboxEventService {
    /**
     * Saves an event to the outbox table. MUST be called within an existing
     * transaction that also includes the primary business data change.
     *
     * @param event An instance of DomainEvent
     * @return The persisted OutboxEvent entity.
     */
     OutboxEvent saveEvent(@SuppressWarnings("rawtypes")  DomainEvent event);

     OutboxEvent saveUserUpsertEvent(Object payload);

     OutboxEvent saveNotificationEvent(String id, NotificationEventType eventType, String sourceId, String targetId);
}