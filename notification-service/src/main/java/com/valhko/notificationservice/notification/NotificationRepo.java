package com.valhko.notificationservice.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NotificationRepo extends JpaRepository<Notification, String>, JpaSpecificationExecutor<Notification> {
}
