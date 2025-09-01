package com.valhko.common.event.user;

import com.valhko.common.event.base.DomainEvent;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserUpsertEvent implements DomainEvent<UserEventType> {
    private UserEventType eventType = UserEventType.USER_UPSERT;
    private String id;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String username;
    private String preferences;

    public static UserUpsertEvent from(Object payload) {
        UserUpsertEvent userUpsertEvent = new UserUpsertEvent();
        BeanUtils.copyProperties(payload, userUpsertEvent);
        return userUpsertEvent;
    }

    @Override
    public String getAggregateId() {
        return this.id;
    }

    @Override
    public LocalDateTime getTimestamp() {
        return LocalDateTime.now();
    }

    @Override
    public String getAggregateType() {
        return "User";
    }

    @Override
    public int getVersion() {
        return 1;
    }

    @Override
    public String getTopic() {
        return "user-upsert-events";
    }
}
