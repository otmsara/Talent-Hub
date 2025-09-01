package com.valhko.notificationservice.notification;

import com.valhko.common.event.notification.NotificationEventType;
import org.springframework.data.jpa.domain.Specification;

public class NotificationSpecs {

    public static Specification<Notification> isSeen(boolean value) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("seen"), value);
    }

    public static Specification<Notification> isRead(boolean value) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("read"), value);
    }

    public static Specification<Notification> hasType(NotificationEventType type) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("notificationType"), type);
    }

    public static Specification<Notification> belongsToUser(String userId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("targetId"), userId);
    }

}
