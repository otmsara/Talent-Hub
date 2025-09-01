package com.valhko.mediaservice.media.converter;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.mediaservice.media.Media;
import com.valhko.mediaservice.media.dto.response.MediaDto;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MediaConverter {

    @Value("${storage.base-url}")
    private String baseUrl;

    public Media convert(MediaDto item) {
        var entity = new Media();
        BeanUtils.copyProperties(item, entity);
        return entity;
    }

    public MediaDto convert(Media item) {
        var dto = new MediaDto();
        BeanUtils.copyProperties(item, dto);
        dto.setUrl(baseUrl + "/" + item.getUrl());
        return dto;
    }

    public MediaInternalDto toInternalDto(Media item) {
        var dto = new MediaInternalDto();
        BeanUtils.copyProperties(item, dto);
        dto.setUrl(baseUrl + "/" + item.getUrl());
        return dto;
    }
}
