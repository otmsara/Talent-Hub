package com.valhko.postservice.reaction;

import com.valhko.common.event.notification.NotificationEventType;
import com.valhko.common.outbox.OutboxEventServiceImpl;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.postservice.comment.Comment;
import com.valhko.postservice.comment.CommentRepo;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.PostRepo;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.reaction.util.ReactionType;
import com.valhko.postservice.reaction.util.ReactionItemType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService {
    private final AgreeRepo agreeRepo;
    private final DisagreeRepo disagreeRepo;
    private final PostRepo postRepo;
    private final CommentRepo commentRepo;
    private final OutboxEventServiceImpl outboxEventService;

    @Override
    @Transactional
    public void create(String itemId, ReactionItemType itemType, ReactionType reactionType) {
        String userId = UserContextHolder.getUserInfo().userId();
        String ownerId;
        if (itemType == ReactionItemType.post) {
            Post post = postRepo.findById(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("The requested post or project was not found."));

            ownerId = post.getPostedById();

            if (post.getStatus() == PostStatus.PRIVATE && !userId.equals(post.getPostedById()))
                throw new ForbiddenRequestException("You do not have permission to react to this post.");
        } else {
            Comment comment = commentRepo.findById(itemId)
                    .orElseThrow(() -> new ResourceNotFoundException("The requested comment was not found."));

            ownerId = comment.getCreatedById();
        }

        deleteIfAlreadyExists(itemId, userId);

        String id;
        if (reactionType == ReactionType.agree) {
            Agree saved = agreeRepo.save(
                    Agree.builder().userId(userId).activityId(itemId).activityType(itemType).build());
            id = saved.getId();
        } else {
            Disagree saved = disagreeRepo.save(
                    Disagree.builder().userId(userId).activityId(itemId).activityType(itemType).build());
            id = saved.getId();
        }

        if (reactionType == ReactionType.agree)
            sendNotification(id, itemType, userId, ownerId);
    }

    @Override
    @Transactional
    public void delete(String id, ReactionType reactionType) {
        String userId = UserContextHolder.getUserInfo().userId();

        int deletedCount;

        if (reactionType == ReactionType.agree)
            deletedCount = agreeRepo.deleteByActivityIdAndUserId(id, userId);
        else
            deletedCount = disagreeRepo.deleteByActivityIdAndUserId(id, userId);

        if (deletedCount == 0)
            throw new InvalidArgumentsException("Operation failed.");
    }

    private void deleteIfAlreadyExists(String itemId, String userId) {
        agreeRepo.deleteByActivityIdAndUserId(itemId, userId);
        disagreeRepo.deleteByActivityIdAndUserId(itemId, userId);
    }

    private void sendNotification(String itemId, ReactionItemType itemType, String source, String target) {
        NotificationEventType eventType = switch (itemType) {
            case post -> NotificationEventType.POST_AGREE;
            case comment -> NotificationEventType.COMMENT_AGREE;
        };

        outboxEventService.saveNotificationEvent(itemId, eventType, source, target);
    }
}
