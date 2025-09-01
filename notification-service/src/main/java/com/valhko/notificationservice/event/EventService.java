package com.valhko.notificationservice.event;

import com.valhko.common.system.config.UserContextHolder;
import com.valhko.notificationservice.notification.Notification;
import com.valhko.notificationservice.notification.converter.NotificationConverter;
import com.valhko.notificationservice.notification.dto.response.NotificationDto;
import com.valhko.notificationservice.notification.enricher.NotificationDtoEnricher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepo eventRepo;
    private final NotificationDtoEnricher enricher;
    private final NotificationConverter converter;
    @Value("${event.connection.timeout}")
    private long timeout;

    public SseEmitter create() {
        var id = UserContextHolder.userId();
        var emitter = new SseEmitter(timeout);
        emitter.onCompletion(() -> eventRepo.removeById(id));
        emitter.onTimeout(() -> eventRepo.removeById(id));
        emitter.onError((err) -> {
            eventRepo.removeById(id);
            log.error("Error: Create SSE failed", err);
        });

        return eventRepo.save(id, emitter);
    }

    public SseEmitter findById(String id) {
        return eventRepo.findById(id);
    }

    public void sendNotification(String id, Notification data) {
        SseEmitter emitter = findById(id);
        if (emitter != null) {
            ExecutorService executorService = Executors.newSingleThreadExecutor();
            executorService.execute(() -> {
                try {
                    var dto = converter.convert(data);
                    enricher.enrich(data, dto);
                    emitter.send(dto);
                } catch (IOException e) {
                    log.error("Failed to send notification to the user with id {}", id, e);
                    emitter.completeWithError(e);
                }
            });
        }
    }
}