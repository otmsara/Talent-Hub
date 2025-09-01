package com.valhko.feedservice.feeditem;

import com.valhko.common.client.postservice.post.PostClientService;
import com.valhko.common.client.userservice.network.NetworkClientService;
import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.feedservice.feeditem.util.ContentType;
import com.valhko.feedservice.feeditem.util.FeedType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FeedGenerationService {

    private final NetworkClientService networkClientService;
    private final PostClientService postClientService;
    private final FeedItemRepo feedItemRepo;
    private final UserClientService userClientService;

    @Async
    public CompletableFuture<Void> generateFeedAsync(String userId, FeedType feedType) {
        return CompletableFuture.runAsync(() -> generateFeed(userId, feedType));
    }

    public void generateFeed(String userId, FeedType feedType) {
        try {
            switch (feedType) {
                case FOLLOWING:
                    generateFollowingFeed(userId);
                    break;
                case TRENDING:
                    generateTrendingFeed(userId);
                    break;
                case ALL:
                    generatePersonalizedFeed(userId);
                    break;
            }
        } catch (Exception e) {
            log.error("Error generating feed for user: {} type: {}", userId, feedType, e);
        }
    }

    /**
     * Generate following feed - posts from users they follow
     */
    private void generateFollowingFeed(String userId) {
        var followingIds = networkClientService.getNetworking(userId);

        if (followingIds.isEmpty()) {
            log.info("User {} has no following, skipping following feed generation", userId);
            return;
        }

        // Get recent posts from following
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        var recentPosts = postClientService.getPostsIdsFromUsers(followingIds, since);

        if (recentPosts.isEmpty()) {
            log.info("No recent posts from following for user: {}", userId);
            return;
        }

        // Convert to feed items
        List<FeedItem> feedItems = recentPosts.stream()
                .map(postId -> new FeedItem(userId, postId, ContentType.POST, FeedType.FOLLOWING))
                .collect(Collectors.toList());

        // Save to database
        feedItemRepo.saveAll(feedItems);

        log.info("Generated following feed for user: {} with {} items", userId, feedItems.size());
    }

    /**
     * Generate trending feed - popular posts across platform
     */
    private void generateTrendingFeed(String userId) {
        try {
            LocalDateTime since = LocalDateTime.now().minusHours(24);
            var criteria = new HashMap<String, String>();
            criteria.put("sortBy", "popularity");
            criteria.put("since", since.toString());
            criteria.put("limit", "50");

            var trendingPosts = postClientService.findByCriteria(criteria, userId);

            if (trendingPosts.isEmpty()) {
                log.info("No trending posts found for user: {}", userId);
                return;
            }

            List<FeedItem> feedItems = trendingPosts.stream()
                    .map(post -> new FeedItem(userId, (String) post.get("id"),
                            ContentType.POST, FeedType.TRENDING))
                    .collect(Collectors.toList());

            feedItemRepo.saveAll(feedItems);

            log.info("Generated trending feed for user: {} with {} items", userId, feedItems.size());

        } catch (Exception e) {
            log.error("Error generating trending feed for user: {}", userId, e);
        }
    }

    /**
     * Generate personalized "All" feed - interest-based content
     */
    private void generatePersonalizedFeed(String userId) {
        try {
            var userInterests = userClientService.getUserInterests(userId);

            if (userInterests.isEmpty()) {
                log.warn("User {} has no interests, generating popular content instead", userId);
                generatePopularContentFeed(userId);
                return;
            }

            // Get content based on user interests
            var criteria = new HashMap<String, String>();
            criteria.put("interests", userInterests);
            criteria.put("sortBy", "relevance");
            criteria.put("timeRange", "7d");
            criteria.put("limit", "50");

            var interestPosts = postClientService.findByCriteria(criteria, userId);

            if (interestPosts.isEmpty()) {
                log.info("No interest-based posts found for user: {}, falling back to popular", userId);
                generatePopularContentFeed(userId);
                return;
            }

            List<FeedItem> feedItems = interestPosts.stream()
                    .map(post -> new FeedItem(userId, (String) post.get("id"),
                            ContentType.POST, FeedType.ALL))
                    .collect(Collectors.toList());

            feedItemRepo.saveAll(feedItems);

            log.info("Generated personalized feed for user: {} with {} items", userId, feedItems.size());

        } catch (Exception e) {
            log.error("Error generating personalized feed for user: {}", userId, e);
            // Fallback to popular content
            generatePopularContentFeed(userId);
        }
    }

    /**
     * Generate interest-based feed items - for fallback scenarios
     */
    public List<FeedItem> generateInterestBasedFeedItems(String userId, int limit) {
        try {
            var userInterests = userClientService.getUserInterests(userId);

            if (userInterests.isEmpty()) {
                log.warn("User {} has no interests, using popular content", userId);
                return generatePopularContentFeedItems(userId, limit);
            }

            var criteria = new HashMap<String, String>();
            criteria.put("interests", userInterests);
            criteria.put("sortBy", "relevance");
            criteria.put("timeRange", "7d");
            criteria.put("limit", limit+"");

            var interestPosts = postClientService.findByCriteria(criteria, userId);

            return interestPosts.stream()
                    .map(post -> new FeedItem(userId, (String) post.get("id"),
                            ContentType.POST, FeedType.ALL))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error generating interest-based feed items for user: {}", userId, e);
            return generatePopularContentFeedItems(userId, limit);
        }
    }

    /**
     * Generate popular content feed items - emergency fallback
     */
    public List<FeedItem> generatePopularContentFeedItems(String userId, int limit) {
        try {
            LocalDateTime since = LocalDateTime.now().minusHours(48);
            var criteria = new HashMap<String, String>();
            criteria.put("sortBy", "popularity");
            criteria.put("since", since.toString());
            criteria.put("limit", limit+"");

            var popularPosts = postClientService.findByCriteria(criteria, userId);

            return popularPosts.stream()
                    .map(post -> new FeedItem(userId, (String) post.get("id"),
                            ContentType.POST, FeedType.TRENDING))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error generating popular content for user: {}", userId, e);
            return Collections.emptyList();
        }
    }

    /**
     * Generate popular content feed - fallback method
     */
    private void generatePopularContentFeed(String userId) {
        List<FeedItem> items = generatePopularContentFeedItems(userId, 30);
        items.forEach(item -> item.setFeedType(FeedType.ALL)); // Set as ALL type

        if (!items.isEmpty()) {
            feedItemRepo.saveAll(items);
            log.info("Generated popular content feed with {} items for user: {}", items.size(), userId);
        }
    }
}