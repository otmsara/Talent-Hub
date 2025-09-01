package com.valhko.notificationservice.event;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface EventRepo {
    SseEmitter save(String id, SseEmitter sseEmitter);
    void removeById(String id);
    SseEmitter findById(String id);
}
