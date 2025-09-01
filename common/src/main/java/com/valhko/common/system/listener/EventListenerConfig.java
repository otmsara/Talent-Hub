package com.valhko.common.system.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.Map;
import java.util.function.Consumer;

@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "common.system.listener", name = "enabled", havingValue = "true")
public class EventListenerConfig {
    private final Map<String, EventHandler> eventHandlers;

    @Bean
    public Consumer<Message<String>> consumer() {
        return message -> {
            var eventId = message.getHeaders().get("eventId", String.class);

            try {
                var eventType = message.getHeaders().get("eventType", String.class);

                var handler = eventHandlers.get(eventType);

                if (handler == null) {
                    log.warn("No handler found for event type: {} and event id {}", eventType, eventId);
                } else {
                    log.info("Handing the event with id {}", eventId);

                    handler.handle(message);

                    log.info("Event {} handled successfully", eventId);
                }
            } catch (Exception e) {
                log.error("Exception occurred during message processing for ID {}. Rethrowing for binder retry/DLQ.", eventId, e);
                throw new RuntimeException("Message processing failed for ID " + eventId, e);
            }
        };
    }

}
