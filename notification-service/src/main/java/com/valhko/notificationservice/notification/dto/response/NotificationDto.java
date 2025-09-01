package com.valhko.notificationservice.notification.dto.response;

import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.event.notification.NotificationEventType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private String id;
    private NotificationEventType notificationType;
    private String message;
    private UserInternalDto source;
    private UserInternalDto target;
    private boolean read;
    private boolean seen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
