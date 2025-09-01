package com.valhko.common.outbox;

public interface OutboxEventProcessorTask {
    void processEvents();
}
