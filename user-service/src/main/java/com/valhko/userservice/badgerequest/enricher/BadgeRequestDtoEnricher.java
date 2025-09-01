package com.valhko.userservice.badgerequest.enricher;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.userservice.badgerequest.BadgeRequest;
import com.valhko.userservice.badgerequest.dto.response.BadgeRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.groupingBy;

@Component
@RequiredArgsConstructor
public class BadgeRequestDtoEnricher {
    private final MediaClientService mediaClientService;

    public void enrich(BadgeRequest entity, BadgeRequestDto dto) {
        var attachments = mediaClientService.findByItemIds(List.of(entity.getId()));
        dto.setAttachments(attachments);
    }

    public void enrich(Page<BadgeRequest> entities, Page<BadgeRequestDto> dtoList) {
        var mediaResult = mediaClientService.findByItemIds(entities.map(BadgeRequest::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        dtoList.forEach(e -> {
            e.setAttachments(mediaMap.get(e.getId()));
        });
    }
}
