package com.valhko.userservice.badgerequest.converter;

import com.valhko.userservice.badgerequest.BadgeRequest;
import com.valhko.userservice.badgerequest.dto.request.BadgeRequestCreateDto;
import com.valhko.userservice.badgerequest.dto.request.BadgeRequestUpdateDto;
import com.valhko.userservice.badgerequest.dto.response.BadgeRequestDto;
import com.valhko.userservice.user.converter.UserConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BadgeRequestConverter {
    private final UserConverter converter;

    public BadgeRequest convert(BadgeRequestCreateDto dto) {
        var entity = new BadgeRequest();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public BadgeRequest convert(BadgeRequestUpdateDto dto) {
        var entity = new BadgeRequest();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public BadgeRequestDto convert(BadgeRequest entity) {
        var dto = new BadgeRequestDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setRequester(converter.toUserEssentialsDto(entity.getRequester()));
        return dto;
    }
}
