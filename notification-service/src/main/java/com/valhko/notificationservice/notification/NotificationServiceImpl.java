package com.valhko.notificationservice.notification;

import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.event.notification.NotificationEventType;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.notificationservice.event.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final UserClientService userClient;
    private final NotificationRepo notificationRepo;
    private final EventService eventService;

    @Override
    public void create(Notification item) {
        var sourceId = item.getSourceId();
        var targetId = item.getTargetId();

        var sourceUser = userClient.findById(sourceId);
        if (sourceUser == null)
            throw new InvalidArgumentsException("The source user not found");

        var targetUser = userClient.findById(targetId);
        if (targetUser == null)
            throw new InvalidArgumentsException("The target user not found");

        var message = getMessage(item, sourceUser);

        item.setMessage(message);

        item.setSourceId(sourceUser.getId());
        item.setTargetId(targetUser.getId());

        Notification saved = notificationRepo.save(item);

        eventService.sendNotification(targetId, saved);
    }

    @Override
    public Page<Notification> findByCriteria(Map<String, String> criteria, Pageable pageable) {
        var seen = criteria.get("seen");
        var read = criteria.get("seen");
        var type = criteria.get("notificationType");

        Specification<Notification> spec = Specification.where(null);

        if (seen != null && (seen.equals("true") || seen.equals("false")))
            spec = spec.and(NotificationSpecs.isSeen(Boolean.parseBoolean(seen)));

        if (read != null && (read.equals("true") || read.equals("false")))
            spec = spec.and(NotificationSpecs.isRead(Boolean.parseBoolean(read)));

        if (type != null)
            spec = spec.and(NotificationSpecs.hasType(NotificationEventType.valueOf(type)));

        spec = spec.and(NotificationSpecs.belongsToUser(UserContextHolder.userId()));

        return notificationRepo.findAll(spec, pageable);
    }

    @Override
    public void update(String id, Map<String, String> data) {
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The notification was not found"));

        if (!notification.getTargetId().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You can't update this notification");

        var seen = data.get("seen");
        var read = data.get("read");

        if (seen != null && (seen.equals("true") || seen.equals("false")))
            notification.setSeen(Boolean.parseBoolean(seen));

        if (read != null && (read.equals("true") || read.equals("false")))
            notification.setRead(Boolean.parseBoolean(read));

        notificationRepo.save(notification);
    }

    private static String getMessage(Notification item, UserInternalDto sourceUser) {
        var sourceFullName = String.format("%s %s", sourceUser.getFirstName(), sourceUser.getLastName());

        return switch (item.getNotificationType()) {
            case USER_CONNECT -> String.format("<b>%s</b> started networking with you", sourceFullName);
            case POST_AGREE -> String.format("<b>%s</b> has agreed with your post", sourceFullName);
            case COMMENT_AGREE -> String.format("<b>%s</b> has agreed with your comment", sourceFullName);
            case POST_COMMENT -> String.format("<b>%s</b> has commented on your post", sourceFullName);
            case COMMENT_REPLY -> String.format("<b>%s</b> has replied to your comment", sourceFullName);
        };
    }
}
