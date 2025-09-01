package com.valhko.postservice.post.enricher;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.postservice.contribution.Contribution;
import com.valhko.postservice.contribution.dto.response.ContributionDto;
import com.valhko.postservice.contribution.enricher.ContributionDtoEnricher;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.PostRepo;
import com.valhko.postservice.post.UserActionService;
import com.valhko.postservice.post.dto.response.PostDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Component
@RequiredArgsConstructor
public class PostDtoEnricher {
    private final MediaClientService mediaClient;
    private final UserClientService userClient;
    private final UserActionService userActionService;
    private final ContributionDtoEnricher contributionDtoEnricher;
    private final PostRepo postRepo;

    public void enrich(Post entity, PostDto dto) {
        // Enrich post with media
        var mediaResult = mediaClient.findByItemIds(List.of(entity.getId()));

        dto.setMedia(mediaResult);

        // Enrich post with user
        var userResult = userClient.findById(entity.getPostedById());

        dto.setPostedBy(userResult);

        // Enrich post with reaction
        var status = userActionService.getUserActionForPost(UserContextHolder.userId(), dto.getId());
        dto.setIsAgreed(status.agreed());
        dto.setIsDisagreed(status.disagreed());

        // Enrich post contributions with user data
        contributionDtoEnricher.enrich(entity.getContributions(), dto.getContributions());

        if (entity.getOriginalPost() != null)
            enrich(entity.getOriginalPost(), dto.getOriginalPost());
    }

    public void enrich(Page<Post> entities, Page<PostDto> dtoList) {
        // Prepare: Enrich posts with media
        var mediaResult = mediaClient.findByItemIds(entities.stream().map(Post::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        // Prepare: Enrich posts with users
        var userIds = entities.stream().map(Post::getPostedById).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        Map<String, UserInternalDto> userMapWithPostIdAsKey;

        if (!userById.isEmpty()) {
            userMapWithPostIdAsKey = entities.stream()
                    .collect(Collectors.toMap(
                            Post::getId,
                            post -> userById.get(post.getPostedById())
                    ));
        } else {
            userMapWithPostIdAsKey = new HashMap<>();
        }


        // Prepare: Enrich posts with reactions
        Set<String> ids = entities.stream()
                .map(Post::getId)
                .collect(Collectors.toSet());

        var actionStatusMap = userActionService.getUserActionsForPosts(UserContextHolder.userId(),
                ids);

        // Prepare
        var contributionsEntities = new ArrayList<Contribution>();
        var contributionsDtoList = new ArrayList<ContributionDto>();
        var originalPostEntities = new ArrayList<Post>();
        var originalPostDtoList = new ArrayList<PostDto>();

        entities.forEach(e -> {
            contributionsEntities.addAll(e.getContributions());
            if (e.getOriginalPost() != null)
                originalPostEntities.add(e.getOriginalPost());
        });

        dtoList.forEach(e -> {
            contributionsDtoList.addAll(e.getContributions());
            if (e.getOriginalPost() != null)
                originalPostDtoList.add(e.getOriginalPost());
        });

        // Enrich post contributions with user data
        contributionDtoEnricher.enrich(contributionsEntities, contributionsDtoList);
        // Enrich original posts with user data
        if (!originalPostEntities.isEmpty())
            enrichOriginalPosts(originalPostEntities, originalPostDtoList);


        // Enrich
        dtoList.forEach(e -> {
            e.setMedia(mediaMap.get(e.getId()));
            e.setPostedBy(userMapWithPostIdAsKey.get(e.getId()));

            var status = actionStatusMap.getOrDefault(e.getId(),
                    new UserActionService.ActionStatus(false, false));

            e.setIsAgreed(status.agreed());
            e.setIsDisagreed(status.disagreed());
        });

    }

    public void enrich(List<Post> entities, List<PostDto> dtoList, String userId) {
        // Prepare: Enrich posts with media
        var mediaResult = mediaClient.findByItemIds(entities.stream().map(Post::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        // Prepare: Enrich posts with users
        var userIds = entities.stream().map(Post::getPostedById).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        Map<String, UserInternalDto> userMapWithPostIdAsKey;

        if (!userById.isEmpty()) {
            userMapWithPostIdAsKey = entities.stream()
                    .collect(Collectors.toMap(
                            Post::getId,
                            post -> userById.get(post.getPostedById())
                    ));
        } else {
            userMapWithPostIdAsKey = new HashMap<>();
        }


        // Prepare: Enrich posts with reactions
        Set<String> ids = entities.stream()
                .map(Post::getId)
                .collect(Collectors.toSet());

        var actionStatusMap = userActionService.getUserActionsForPosts(userId,
                ids);

        // Prepare
        var contributionsEntities = new ArrayList<Contribution>();
        var contributionsDtoList = new ArrayList<ContributionDto>();
        var originalPostEntities = new ArrayList<Post>();
        var originalPostDtoList = new ArrayList<PostDto>();

        entities.forEach(e -> {
            contributionsEntities.addAll(e.getContributions());
            if (e.getOriginalPost() != null)
                originalPostEntities.add(e.getOriginalPost());
        });

        dtoList.forEach(e -> {
            contributionsDtoList.addAll(e.getContributions());
            if (e.getOriginalPost() != null)
                originalPostDtoList.add(e.getOriginalPost());
        });

        // Enrich post contributions with user data
        contributionDtoEnricher.enrich(contributionsEntities, contributionsDtoList);
        // Enrich original posts with user data
        if (!originalPostEntities.isEmpty())
            enrichOriginalPosts(originalPostEntities, originalPostDtoList);


        // Enrich
        dtoList.forEach(e -> {
            e.setMedia(mediaMap.get(e.getId()));
            e.setPostedBy(userMapWithPostIdAsKey.get(e.getId()));

            var status = actionStatusMap.getOrDefault(e.getId(),
                    new UserActionService.ActionStatus(false, false));

            e.setIsAgreed(status.agreed());
            e.setIsDisagreed(status.disagreed());
        });

    }

    public void enrichOriginalPosts(List<Post> entities, List<PostDto> dtoList) {
        var userIds = entities.stream().map(Post::getPostedById).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        Map<String, UserInternalDto> userMapWithPostIdAsKey;

        if (!userById.isEmpty()) {
            userMapWithPostIdAsKey = entities.stream()
                    .collect(Collectors.toMap(
                            Post::getId,
                            post -> userById.get(post.getPostedById())
                    ));
        } else {
            userMapWithPostIdAsKey = new HashMap<>();
        }

        dtoList.forEach(e -> {
            e.setPostedBy(userMapWithPostIdAsKey.get(e.getId()));
        });
    }

}
