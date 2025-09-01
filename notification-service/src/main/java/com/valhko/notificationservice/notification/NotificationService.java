package com.valhko.notificationservice.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface NotificationService {
    void create(Notification item);

    Page<Notification> findByCriteria(Map<String, String> criteria, Pageable pageable);

    void update(String id, Map<String, String> data);
}
