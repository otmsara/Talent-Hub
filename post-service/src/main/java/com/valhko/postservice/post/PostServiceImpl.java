package com.valhko.postservice.post;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.client.userservice.network.NetworkClientService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {
    private final PostRepo repo;
    private final MediaClientService mediaClient;
    private final NetworkClientService networkClientService;

    @Override
    @Transactional
    public Post create(Post item) {
        item.setPostedById(UserContextHolder.userId());

        // If type is post, then ignore needed contributions
        if (item.getType() == PostType.POST)
            item.setNeededContributors(Collections.emptyList());

        item.setNeededContributors(item.getNeededContributors().stream().peek(e -> e.setPost(item)).toList());

        Post savedPost = repo.save(item);

        updateMedia(item.getMediaIds(), savedPost.getId());

        return savedPost;
    }

    @Override
    public Post findById(String id) {
        Post post = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The requested post or project was not found."));

        if (!post.getPostedById().equals(UserContextHolder.userId()))
            if (post.getStatus().equals(PostStatus.PRIVATE) || post.getStatus().equals(PostStatus.DRAFT))
                throw new ForbiddenRequestException("You do not have permission to view this private post.");

        if (post.getIsNetworkingOnly()) {
            if (!networkClientService.existsByNetworkedIdAndNetworkingId(UserContextHolder.userId(), post.getPostedById())
                    && !post.getPostedById().equals(UserContextHolder.userId())) {
                throw new ForbiddenRequestException("You do not have permission to view this post, networking only.");
            }

        }

        return post;
    }

    @Override
    public Post update(String id, Post item) {
        Post foundPost = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The post or project to update was not found."));
        if (!foundPost.getPostedById().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You do not have permission to update this post.");

        // Check if post is deleted
        if (foundPost.isDeleted())
            throw new ForbiddenRequestException("You cannot update a deleted post.");

        foundPost.setContent(item.getContent());
        foundPost.setStatus(item.getStatus());
        foundPost.setLink(item.getLink());
        foundPost.addNeededContributors(item.getNeededContributors());

        if (item.getIsNetworkingOnly() != null)
            foundPost.setIsNetworkingOnly(item.getIsNetworkingOnly());

        // if type is post, then ignore needed contributions
        if (foundPost.getType() == PostType.POST)
            foundPost.setNeededContributors(Collections.emptyList());

        updateMedia(item.getMediaIds(), foundPost.getId());

        // Save and return the updated post
        return repo.save(foundPost);
    }

    private void updateMedia(List<String> mediaIds, String postId) {
        mediaClient.updateItemIdWhereIdIn(postId, mediaIds);
    }

    @Override
    @Transactional
    public void delete(String id) {
        Post post = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("The post or project to delete was not found."));
        if (!post.getPostedById().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You do not have permission to delete this post.");

        // Delete media
        post.setDeleted(true);

        repo.save(post);
    }

    @Override
    public List<Post> findByCriteria(Map<String, String> criteria, String userId) {

        int page = Integer.parseInt(criteria.getOrDefault("page", "0"));
        int size = Integer.parseInt(criteria.getOrDefault("size", "20"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // TODO: Should be cached
        Set<String> networkIds = new HashSet<>(networkClientService.getNetworking(userId));


        Specification<Post> spec = Specification.where(null);

        spec = spec.and(PostSpecs.isVisibleToUser(userId, networkIds));

        if (StringUtils.hasText(criteria.get("userId"))) {
            spec = spec.and(PostSpecs.belongsToUserId(criteria.get("userId")));
        }
        if (StringUtils.hasText(criteria.get("content"))) {
            spec = spec.and(PostSpecs.containsContent(criteria.get("content")));
        }
        if (StringUtils.hasText(criteria.get("type"))) {
            spec = spec.and(PostSpecs.hasType(PostType.valueOf(criteria.get("type"))));
        }

        if (StringUtils.hasText(criteria.get("status"))) {
            PostStatus postStatus = PostStatus.valueOf(criteria.get("status"));
            spec = spec.and(PostSpecs.hasStatus(postStatus));
            if (postStatus == PostStatus.PRIVATE || postStatus == PostStatus.DRAFT) {
                // Ensure user can only see their own private/draft posts
                spec = spec.and(PostSpecs.belongsToUserId(userId));
            }
        } else {
            // Default to only showing public posts if no status is specified
            spec = spec.and(PostSpecs.hasStatus(PostStatus.PUBLIC));
        }

        if (StringUtils.hasText(criteria.get("interests"))) {
            List<String> interests = Arrays.asList(criteria.get("interests").split(","));
            spec = spec.and(PostSpecs.matchesAnyInterest(interests));
        }

        if ("popularity".equalsIgnoreCase(criteria.get("sortBy"))) {
            spec = spec.and(PostSpecs.sortByPopularity());
        }

        if (StringUtils.hasText(criteria.get("since"))) {
            try {
                // The string must be in ISO-8601 format
                LocalDateTime sinceDate = LocalDateTime.parse(criteria.get("since"));
                spec = spec.and(PostSpecs.createdAfter(sinceDate));
            } catch (DateTimeParseException e) {
                log.warn("Invalid 'since' date format provided: {}", criteria.get("since"));
                throw new InvalidArgumentsException("Invalid 'since' date format provided");
            }
        }

        Page<Post> postPage = repo.findAll(spec, pageable);

        return postPage.getContent();
    }

    @Override
    public Post sharePost(String postId, String content) {
        // Find the original post directly from the repository
        Post originalPost = repo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("The requested post or project was not found."));

        // If post is networking only, then it not sharable
        if (originalPost.getIsNetworkingOnly())
            throw new ForbiddenRequestException("You cannot share a networking only post.");

        // Check if the post is not public
        if (!originalPost.getStatus().equals(PostStatus.PUBLIC))
            throw new ForbiddenRequestException("You cannot share a private or draft post.");

        // You can share a deleted post
        if (originalPost.isDeleted())
            throw new ForbiddenRequestException("You cannot share a deleted post.");

        // Create a new post as a share
        Post sharedPost = new Post();

        sharedPost.setPostedById(UserContextHolder.userId());
        sharedPost.setOriginalPost(originalPost);
        sharedPost.setContent(content);
        sharedPost.setType(PostType.SHARED);
        sharedPost.setStatus(PostStatus.PUBLIC);
        sharedPost.setIsNetworkingOnly(false);

        // Save the shared post
        return repo.save(sharedPost);
    }

    @SuppressWarnings("incomplete-switch")
    @Override
    public Page<Post> findByCriteria(Map<String, String> criteria, Pageable pageable) {
        Specification<Post> spec = Specification.where(null);

        var currentUserId = UserContextHolder.userId();
        var userId = criteria.get("userId");
        var content = criteria.get("content");
        var status = criteria.get("status");
        var type = criteria.get("type");
        var deleted = criteria.get("deleted");

        if (StringUtils.hasLength(userId)) {
            spec = spec.and(PostSpecs.belongsToUserId(userId));
        }

        if (StringUtils.hasLength(content)) {
            spec = spec.and(PostSpecs.containsContent(content));
        }

        if (StringUtils.hasLength(type)) {
            spec = spec.and(PostSpecs.hasType(PostType.valueOf(type)));
        }

        if (StringUtils.hasLength(status)) {
            PostStatus postStatus = PostStatus.valueOf(status);
            spec = spec.and(PostSpecs.hasStatus(postStatus));

            switch (postStatus) {
                case PRIVATE, DRAFT -> spec = spec.and(PostSpecs.belongsToUserId(currentUserId));
            }

        } else {
            spec = spec.and(PostSpecs.hasPublicStatus());
        }

        return repo.findAll(spec, pageable);
    }

    @Override
    public Page<Post> myProjectsContributions(Pageable pageable) {
        return repo.findByContributionsUserId(UserContextHolder.userId(), pageable);
    }
}
