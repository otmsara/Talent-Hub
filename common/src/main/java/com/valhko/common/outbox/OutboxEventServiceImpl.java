package com.valhko.common.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.valhko.common.event.base.DomainEvent;
import com.valhko.common.event.notification.NotificationEvent;
import com.valhko.common.event.notification.NotificationEventType;
import com.valhko.common.event.user.UserUpsertEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(prefix = "common.outbox-event", name = "enabled", havingValue = "true")
public class OutboxEventServiceImpl implements OutboxEventService {
    private final OutboxEventRepo outBoxEventRepo;
    private final ObjectMapper objectMapper;

    public OutboxEvent saveEvent(@SuppressWarnings("rawtypes") DomainEvent event) {
        try {
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateType(event.getAggregateType())
                    .aggregateId(event.getAggregateId())
                    .eventType(event.getEventType().name())
                    .payload(objectMapper.writeValueAsString(event))
                    .version(event.getVersion())
                    .topic(event.getTopic())
                    .timestamp(event.getTimestamp())
                    .build();
            OutboxEvent savedEvent = outBoxEventRepo.save(outboxEvent);
            log.info("Event [{}] saved to outbox with ID [{}] for aggregate ID [{}]",
                    event.getEventType(), savedEvent.getEventId(), event.getAggregateId());
            return savedEvent;
        } catch (JsonProcessingException e) {
            log.error("CRITICAL: Failed to serialize event payload for aggregate ID {}: {}",
                    event.getAggregateId(), e.getMessage(), e);
            throw new RuntimeException("Failed to serialize event payload for Outbox", e);
        }
    }

    @Override
    public OutboxEvent saveUserUpsertEvent(Object payload) {
        return saveEvent(UserUpsertEvent.from(payload));
    }

    @Override
    public OutboxEvent saveNotificationEvent(String id, NotificationEventType eventType, String sourceId, String targetId) {
        // Don't send notification if source and target are the same
        if (sourceId.equals(targetId)) return null;
        return saveEvent(new NotificationEvent(id, eventType, sourceId, targetId));
    }
}