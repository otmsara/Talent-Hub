package com.valhko.common.outbox;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@ConditionalOnProperty(prefix = "common.outbox-event", name = "enabled", havingValue = "true")
public interface OutboxEventRepo extends JpaRepository<OutboxEvent, String> {
    List<OutboxEvent> findTop10ByDeliveredOrderByTimestampAsc(boolean isDelivered);
}
