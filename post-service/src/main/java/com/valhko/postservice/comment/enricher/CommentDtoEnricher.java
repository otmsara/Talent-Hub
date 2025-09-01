package com.valhko.postservice.comment.enricher;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.postservice.comment.Comment;
import com.valhko.postservice.comment.dto.response.CommentDto;
import com.valhko.postservice.reaction.AgreeRepo;
import com.valhko.postservice.reaction.DisagreeRepo;
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
public class CommentDtoEnricher {
    private final MediaClientService mediaClient;
    private final UserClientService userClient;
    private final AgreeRepo agreeRepo;
    private final DisagreeRepo disagreeRepo;

    public void enrich(Comment entity, CommentDto dto) {
        // Enrich comment with user
        var userResult = userClient.findById(entity.getCreatedById());

        dto.setCreatedBy(userResult);

        if (!entity.isDeleted()) {
            // Enrich comment with media
            var mediaResult = mediaClient.findByItemIds(List.of(entity.getId()));

            dto.setMedia(mediaResult);

            // Enrich comment with reaction of this user
            var userId = UserContextHolder.userId();
            dto.setIsAgreed(agreeRepo.existsByActivityIdAndUserId(dto.getId(), userId));
            dto.setIsDisagreed(disagreeRepo.existsByActivityIdAndUserId(dto.getId(), userId));
        }
    }

    public void enrich(Page<Comment> entities, Page<CommentDto> dtoList) {
        // Prepare: Enrich posts with media
        var entitiesNotDeleted = entities.stream().filter(e -> !e.isDeleted()).toList();
        var mediaResult = mediaClient.findByItemIds(entitiesNotDeleted.stream().map(Comment::getId).toList());

        var mediaMap = mediaResult.stream().collect(groupingBy(MediaInternalDto::getItemId));

        // Enrich comments with user
        var ids = entities.stream().map(Comment::getCreatedById).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(ids));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userMapWithCommentIdAsKey = entities.stream()
                .collect(Collectors.toMap(
                        Comment::getId,
                        comment -> userById.get(comment.getCreatedById())
                ));

        var commentIds = entitiesNotDeleted.stream().map(Comment::getId).collect(Collectors.toSet());
        var userId = UserContextHolder.userId();

        var isAgreedSet = agreeRepo.findCommentIdsByUserIdAndCommentIdIn(userId, commentIds);
        var isDisagreeSet = disagreeRepo.findCommentIdsByUserIdAndCommentIdIn(userId, commentIds);

        dtoList.forEach(e -> {
            if (!e.isDeleted()) {
                e.setIsAgreed(isAgreedSet.contains(e.getId()));
                e.setIsDisagreed(isDisagreeSet.contains(e.getId()));
                e.setMedia(mediaMap.get(e.getId()));
            }
            e.setCreatedBy(userMapWithCommentIdAsKey.get(e.getId()));
        });
    }

}
