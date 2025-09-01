package com.valhko.userservice.badge.converter;

import com.valhko.userservice.badge.Badge;
import com.valhko.userservice.badge.dto.request.BadgeUpdateDto;
import com.valhko.userservice.badge.dto.response.BadgeDto;
import io.micrometer.core.instrument.binder.BaseUnits;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class BadgeConverter {
    public BadgeDto convert(Badge entity) {
        var dto = new BadgeDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public Badge convert(BadgeUpdateDto dto) {
        var item = new Badge();
        BeanUtils.copyProperties(dto, item);
        return item;
    }
}
