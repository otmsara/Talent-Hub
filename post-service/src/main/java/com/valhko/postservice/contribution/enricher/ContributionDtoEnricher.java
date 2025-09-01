package com.valhko.postservice.contribution.enricher;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.postservice.contribution.Contribution;
import com.valhko.postservice.contribution.dto.response.ContributionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Component
@RequiredArgsConstructor
public class ContributionDtoEnricher {
    private final MediaClientService mediaClient;
    private final UserClientService userClient;

    public void enrich(Contribution entity, ContributionDto dto) {
        // Enrich post with media
        var mediaResult = mediaClient.findByItemIds(List.of(entity.getId()));

        dto.setAttachments(mediaResult);

        // Enrich post with user
        var userResult = userClient.findById(entity.getUserId());

        dto.setUser(userResult);
    }

    public void enrich(Page<Contribution> entities, Page<ContributionDto> dtoList) {
        // Prepare: Enrich contributions with media
        var mediaResult = mediaClient.findByItemIds(entities.stream().map(Contribution::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        // Prepare: Enrich posts with users
        var userIds = entities.stream().map(Contribution::getUserId).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userMapWithPostIdAsKey = entities.stream()
                .collect(Collectors.toMap(
                        Contribution::getId,
                        e -> userById.get(e.getUserId())
                ));

        // Enrich
        dtoList.forEach(e -> {
            e.setAttachments(mediaMap.get(e.getId()));
            e.setUser(userMapWithPostIdAsKey.get(e.getId()));
        });
    }

    public void enrich(List<Contribution> entities, List<ContributionDto> dtoList) {
        // Prepare: Enrich contributions with media
        var mediaResult = mediaClient.findByItemIds(entities.stream().map(Contribution::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        // Prepare: Enrich posts with users
        var userIds = entities.stream().map(Contribution::getUserId).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userMapWithPostIdAsKey = entities.stream()
                .collect(Collectors.toMap(
                        Contribution::getId,
                        e -> userById.get(e.getUserId())
                ));

        // Enrich
        dtoList.forEach(e -> {
            e.setAttachments(mediaMap.get(e.getId()));
            e.setUser(userMapWithPostIdAsKey.get(e.getId()));
        });
    }

}
