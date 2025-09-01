package com.valhko.common.event.base;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

/**
 * Base interface for all domain events intended for publishing.
 */
public interface DomainEvent<T extends Enum<T>> {
    /**
     * The primary identifier of the aggregate this event pertains to (e.g., userId, postId).
     */
    @JsonIgnore
    String getAggregateId();

    /**
     * A unique identifier for the specific event type (e.g., "USER_CREATED", "USER_CONNECTED").
     */
    T getEventType();

    /**
     * The timestamp when the event occurred.
     */
    @JsonIgnore
    LocalDateTime getTimestamp();

    /**
     * The type of the aggregate root (e.g., "User", "Order"). Used for routing/categorization.
     */
    @JsonIgnore
    String getAggregateType();

    /**
     * Event Version
     */
    @JsonIgnore
    int getVersion();

    /**
     * Topic name
     */
    @JsonIgnore
    String getTopic();
}