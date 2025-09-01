package com.valhko.common.outbox;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "common.outbox-event", name = "enabled", havingValue = "true")
public class OutboxEventProcessorTaskImpl implements OutboxEventProcessorTask {
    private final OutboxEventRepo outboxEventRepo;
    private final StreamBridge streamBridge;

    @Override
    @Scheduled(fixedRateString = "${common.outbox-event.processor.task.fixed-rate:5000}")
    @Transactional
    public void processEvents() {
        outboxEventRepo.findTop10ByDeliveredOrderByTimestampAsc(false).forEach(event -> {
            try {
                log.info("Processing outbox event: {}", event.getEventId());

                var message = getMessage(event);

                boolean sent = streamBridge.send(event.getTopic(), message);

                if (sent) {
                    log.info("StreamBridge send SUCCESS for outbox event {}", event.getEventId());
                    event.setDelivered(true);
                    outboxEventRepo.save(event);
                } else {
                    log.warn("!!! StreamBridge send FAILED for outbox event {}.", event.getEventId());
                    throw new RuntimeException("Failed to send event " + event.getEventId());
                }
            } catch (RuntimeException e) {
                log.error("Error processing event {}", event.getEventId(), e);
            }
        });
    }

    private Message<String> getMessage(OutboxEvent event) {
        return MessageBuilder.withPayload(event.getPayload())
                .setHeader("eventId", event.getEventId())
                .setHeader("eventType", event.getEventType())
                .setHeader("aggregateId", event.getAggregateId())
                .setHeader("aggregateType", event.getAggregateType())
                .setHeader("version", event.getVersion())
                .build();
    }
}
