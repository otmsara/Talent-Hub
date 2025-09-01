package com.valhko.notificationservice.notification.eventhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valhko.common.event.notification.NotificationEvent;
import com.valhko.common.system.listener.EventHandler;
import com.valhko.notificationservice.notification.Notification;
import com.valhko.notificationservice.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;

@Slf4j
@RequiredArgsConstructor
public class NotificationEventHandler implements EventHandler {
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    @Override
    public void handle(Message<String> message) throws Exception {
        var messageId = message.getHeaders().get("eventId");
        log.info("Handling event, message ID: {}", messageId);
        try {
            var event = objectMapper.readValue(message.getPayload(), NotificationEvent.class);

            notificationService.create(Notification.from(event));

            log.info("Processed for user ID: {}", event.getId());

        } catch (Exception e) {
            log.error("Failed processing event, message ID {}: {}", messageId, e.getMessage(), e);
            throw e; // Re-throw to let the dispatcher handle errors (DLQ/Abandon)
        }
    }
}
