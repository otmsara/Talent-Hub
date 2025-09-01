package com.valhko.notificationservice.event;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;

@Component
public class InMemoryEventRepo implements EventRepo {

    private final Map<String, SseEmitter> events = new HashMap<>();


    @Override
    public SseEmitter save(String id, SseEmitter sseEmitter) {
        return events.put(id, sseEmitter);
    }

    @Override
    public void removeById(String id) {
        events.remove(id);
    }

    @Override
    public SseEmitter findById(String id) {
        return events.get(id);
    }
}
