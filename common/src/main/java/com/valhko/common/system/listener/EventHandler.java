package com.valhko.common.system.listener;

import org.springframework.messaging.Message;
import org.springframework.transaction.annotation.Transactional;

/**
 * Interface for handling specific types of domain events.
 */
@FunctionalInterface
public interface EventHandler {
    /**
     * Processes the specific domain event.
     *
     * @param message The raw message containing the event payload and properties.
     * @throws Exception If processing fails (e.g., deserialization, business logic).
     */
    @Transactional
    void handle(Message<String> message) throws Exception;

    /** Define supported event type if needed for auto-registration */
    // default String supportsEventType() { return null; }
}