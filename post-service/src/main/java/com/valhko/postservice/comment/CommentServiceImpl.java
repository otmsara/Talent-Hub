package com.valhko.postservice.comment;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.event.notification.NotificationEventType;
import com.valhko.common.outbox.OutboxEventService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.postservice.comment.util.CommentType;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.PostRepo;
import com.valhko.postservice.post.util.PostStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepo repo;
    private final PostRepo postRepo;
    private final OutboxEventService outboxEventService;
    private final MediaClientService mediaClient;

    @Override
    public Page<Comment> findByPostId(String postId, Pageable pageable) {
        return repo.findByPostIdAndParentId(pageable, postId, null);
    }

    @Override
    @Transactional
    public Comment create(Comment newItem) {
        var validatedPost = validate(newItem.getPost().getId());

        newItem.setPost(validatedPost);
        newItem.setCreatedById(UserContextHolder.userId());

        // Set type
        newItem.setType(CommentType.COMMENT);
        // Check if this comment is a reply
        updateIfCommentIsReplay(newItem);

        Comment savedComment = repo.save(newItem);

        updateMedia(newItem.getMediaIds(), savedComment.getId());

        sentEvent(savedComment);

        return savedComment;
    }

    @Override
    @Transactional
    public Comment update(String id, Comment item) {
        String userId = UserContextHolder.getUserInfo().userId();

        Comment foundComment = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The comment was not found."));

        if (!foundComment.getCreatedById().equals(userId))
            throw new ForbiddenRequestException("You do not have permission to update this comment.");

        foundComment.setContent(item.getContent());

        updateMedia(item.getMediaIds(), foundComment.getId());

        return repo.save(foundComment);
    }

    private void updateMedia(List<String> mediaIds, String commentId) {
        mediaClient.updateItemIdWhereIdIn(commentId, mediaIds);
    }

    @Override
    public Page<Comment> findByParentId(String parentId, Pageable pageable) {
        return repo.findByParentIdAndType(pageable, parentId, CommentType.REPLY);
    }

    @Override
    public void delete(String id) {
        String userId = UserContextHolder.getUserInfo().userId();
        Comment comment = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The comment was not found."));
        if (!comment.getCreatedById().equals(userId))
            throw new ForbiddenRequestException("You do not have permission to delete this comment.");
        comment.setDeleted(true);
        repo.save(comment);
    }

    public void updateIfCommentIsReplay(Comment item) {
        if (item.getParent() != null) {
            String parentId = item.getParent().getId();
            Comment parent = repo.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("The comment you are replying to was not found."));
            item.setParent(parent);
            item.setType(CommentType.REPLY);
        }
    }

    private Post validate(String postId) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new ResourceNotFoundException("The post to comment on was not found."));
        if (post.getStatus() == PostStatus.PRIVATE && !post.getPostedById().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You do not have permission to comment on this post.");
        return post;
    }

    private void sentEvent(Comment savedComment) {
        NotificationEventType eventType = switch (savedComment.getType()) {
            case COMMENT -> NotificationEventType.POST_COMMENT;
            case REPLY -> NotificationEventType.COMMENT_REPLY;
        };

        outboxEventService.saveNotificationEvent(savedComment.getId(), eventType, UserContextHolder.userId(), savedComment.getPost().getPostedById());
    }
}
