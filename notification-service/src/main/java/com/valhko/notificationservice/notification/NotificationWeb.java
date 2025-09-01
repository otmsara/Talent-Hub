package com.valhko.notificationservice.notification;

import com.valhko.common.system.dto.response.Result;
import com.valhko.notificationservice.notification.converter.NotificationConverter;
import com.valhko.notificationservice.notification.dto.response.NotificationDto;
import com.valhko.notificationservice.notification.enricher.NotificationDtoEnricher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationWeb {
    private final NotificationService service;
    private final NotificationConverter converter;
    private final NotificationDtoEnricher enricher;

    @PostMapping("/search")
    public Result<Page<NotificationDto>> findByCriteria(@RequestBody Map<String, String> criteria, Pageable pageable) {
        var items = service.findByCriteria(criteria, pageable);
        var dtoList = items.map(converter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @PatchMapping("/{id}")
    public Result<?> update(@PathVariable String id, @RequestBody Map<String, String> data) {
        service.update(id, data);
        return Result.success();
    }
}
