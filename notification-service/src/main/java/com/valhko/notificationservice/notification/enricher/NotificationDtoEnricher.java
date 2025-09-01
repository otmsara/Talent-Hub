package com.valhko.notificationservice.notification.enricher;

import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.notificationservice.notification.Notification;
import com.valhko.notificationservice.notification.dto.response.NotificationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class NotificationDtoEnricher {
    private final UserClientService userClientService;

    public void enrich(Notification entity, NotificationDto dto) {
        var userSource = userClientService.findById(entity.getSourceId());
        var userTarget = userClientService.findById(entity.getTargetId());

        dto.setSource(userSource);
        dto.setTarget(userTarget);
    }

    public void enrich(Page<Notification> entities, Page<NotificationDto> dtoList) {
        var sourceIds = entities.stream().map(Notification::getSourceId).collect(Collectors.toSet());
        var targetIds = entities.stream().map(Notification::getTargetId).collect(Collectors.toSet());

        var usersSource = userClientService.findByIds(new ArrayList<>(sourceIds));
        var usersTarget = userClientService.findByIds(new ArrayList<>(targetIds));

        var userByIdForSource = usersSource.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userByIdForTarget = usersTarget.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userMapWithNotificationIdAsKeyForSource = new HashMap<String, UserInternalDto>();
        var userMapWithNotificationIdAsKeyForTarget = new HashMap<String, UserInternalDto>();

        entities.forEach(e -> {
            userMapWithNotificationIdAsKeyForSource.put(e.getId(), userByIdForSource.get(e.getSourceId()));
            userMapWithNotificationIdAsKeyForTarget.put(e.getId(), userByIdForTarget.get(e.getTargetId()));
        });

        dtoList.forEach(e -> {
            e.setSource(userMapWithNotificationIdAsKeyForSource.get(e.getId()));
            e.setTarget(userMapWithNotificationIdAsKeyForTarget.get(e.getId()));
        });
    }

}
