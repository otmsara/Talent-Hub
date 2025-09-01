package com.valhko.notificationservice.event;

import com.valhko.notificationservice.notification.Notification;
import com.valhko.notificationservice.notification.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/v1/events")
@RequiredArgsConstructor
public class EventWeb {
    private final EventService eventService;

    @GetMapping
    public SseEmitter createConnection() {
        return eventService.create();
    }
}
