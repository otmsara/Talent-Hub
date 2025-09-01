package com.valhko.notificationservice.notification.converter;

import com.valhko.notificationservice.notification.Notification;
import com.valhko.notificationservice.notification.dto.response.NotificationDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class NotificationConverter {

    public NotificationDto convert(Notification entity) {
        var item = new NotificationDto();
        BeanUtils.copyProperties(entity, item);
        return item;
    }

}
