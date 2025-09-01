package com.valhko.feedservice.feeditem;

import com.valhko.common.client.userservice.network.NetworkClientService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.feedservice.feeditem.dto.response.FeedItemDto;
import com.valhko.feedservice.feeditem.dto.response.FeedResponse;
import com.valhko.feedservice.feeditem.util.ContentType;
import com.valhko.feedservice.feeditem.util.FeedType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FeedService {

    private final FeedItemRepo feedItemRepo;
    private final RedisTemplate<String, Object> redisTemplate;
    private final FeedGenerationService feedGenerationService;
    private final FeedCompositionService feedCompositionService;
    private final NetworkClientService networkClientService;

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MIN_FEED_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 50;
    private static final Duration CACHE_TTL = Duration.ofMinutes(15);

    /**
     * Single unified feed endpoint with guaranteed content delivery
     */
    public FeedResponse getFeed(FeedType feedType, String cursor, Integer limit) {
        var userId = UserContextHolder.userId();
        limit = limit != null ? Math.min(limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;

        // Try cache first
        String cacheKey = buildCacheKey(userId, feedType, cursor, limit);
        FeedResponse cachedFeed = getCachedFeed(cacheKey);
        if (cachedFeed != null) {
            log.debug("Cache hit for feed: {}", cacheKey);
            return cachedFeed;
        }

        // Get feed items with fallback guarantee
        List<FeedItem> feedItems = getFeedItemsWithFallback(userId, feedType, cursor, limit);

        // Compose with external content
        List<FeedItemDto> enrichedItems = feedCompositionService.enrichFeedItems(feedItems);

        // Build response
        FeedResponse response = buildFeedResponse(enrichedItems, feedType, limit);

        // Cache response
        cacheFeed(cacheKey, response);

        return response;
    }

    /**
     * Get feed items with smart fallback to guarantee content
     */
    private List<FeedItem> getFeedItemsWithFallback(String userId, FeedType feedType, String cursor, int limit) {
        List<FeedItem> feedItems = new ArrayList<>();

        try {
            // Try primary feed type first
            feedItems = fetchFeedItems(userId, feedType, cursor, limit);

            // If not enough content, apply fallback
            if (feedItems.size() < MIN_FEED_SIZE) {
                feedItems = applyFallbackStrategy(userId, feedType, cursor, limit, feedItems);
            }

        } catch (Exception e) {
            log.error("Error fetching feed for user: {} type: {}", userId, feedType, e);
            // Emergency fallback
            feedItems = getEmergencyFeed(userId, limit);
        }

        return feedItems;
    }

    /**
     * Apply fallback strategy based on feed type
     */
    private List<FeedItem> applyFallbackStrategy(String userId, FeedType primaryType,
                                                 String cursor, int limit, List<FeedItem> existing) {

        List<FeedItem> allItems = new ArrayList<>(existing);
        int needed = limit - existing.size();

        log.info("Applying fallback for user: {}, primary type: {}, need {} more items",
                userId, primaryType, needed);

        switch (primaryType) {
            case FOLLOWING:
                // If following feed is empty, try interest-based then trending
                allItems.addAll(getFallbackItems(userId, FeedType.ALL, cursor, needed, allItems));
                if (allItems.size() < limit) {
                    allItems.addAll(getFallbackItems(userId, FeedType.TRENDING, cursor,
                            limit - allItems.size(), allItems));
                }
                break;

            case TRENDING:
                // If trending is empty, try interest-based then following
                allItems.addAll(getFallbackItems(userId, FeedType.ALL, cursor, needed, allItems));
                if (allItems.size() < limit) {
                    allItems.addAll(getFallbackItems(userId, FeedType.FOLLOWING, cursor,
                            limit - allItems.size(), allItems));
                }
                break;

            case ALL:
                // If personalized is empty, try trending then following
                allItems.addAll(getFallbackItems(userId, FeedType.TRENDING, cursor, needed, allItems));
                if (allItems.size() < limit) {
                    allItems.addAll(getFallbackItems(userId, FeedType.FOLLOWING, cursor,
                            limit - allItems.size(), allItems));
                }
                break;
        }

        // If still not enough, generate emergency content
        if (allItems.size() < MIN_FEED_SIZE) {
            List<FeedItem> emergencyItems = getEmergencyFeed(userId, MIN_FEED_SIZE - allItems.size());
            allItems.addAll(removeDuplicates(emergencyItems, allItems));
        }

        return allItems;
    }

    /**
     * Get fallback items for a specific type
     */
    private List<FeedItem> getFallbackItems(String userId, FeedType fallbackType, String cursor,
                                            int needed, List<FeedItem> existing) {
        try {
            List<FeedItem> fallbackItems = fetchFeedItems(userId, fallbackType, cursor, needed);
            return removeDuplicates(fallbackItems, existing);
        } catch (Exception e) {
            log.warn("Fallback type {} failed for user: {}", fallbackType, userId, e);
            return Collections.emptyList();
        }
    }

    /**
     * Remove duplicate items based on contentId
     */
    private List<FeedItem> removeDuplicates(List<FeedItem> newItems, List<FeedItem> existing) {
        Set<String> existingContentIds = existing.stream()
                .map(FeedItem::getContentId)
                .collect(Collectors.toSet());

        return newItems.stream()
                .filter(item -> !existingContentIds.contains(item.getContentId()))
                .collect(Collectors.toList());
    }

    /**
     * Emergency feed - guaranteed to return content
     */
    private List<FeedItem> getEmergencyFeed(String userId, int limit) {
        try {
            // Generate interest-based feed immediately
            return feedGenerationService.generateInterestBasedFeedItems(userId, limit);
        } catch (Exception e) {
            log.error("Emergency feed generation failed for user: {}", userId, e);
            // Trigger async generation for future
            feedGenerationService.generateFeedAsync(userId, FeedType.ALL);
            return Collections.emptyList();
        }
    }

    /**
     * Fetch feed items for a specific type
     */
    private List<FeedItem> fetchFeedItems(String userId, FeedType feedType, String cursor, int limit) {
        // Check if we have existing items
        long existingCount = feedItemRepo.countByUserIdAndFeedType(userId, feedType);

        if (existingCount == 0) {
            // Generate feed asynchronously for future requests
            feedGenerationService.generateFeedAsync(userId, feedType);
            return Collections.emptyList();
        }

        Pageable pageable = PageRequest.of(0, limit);

        if (cursor != null) {
            LocalDateTime cursorTime = LocalDateTime.parse(cursor);
            return feedItemRepo.findByUserIdAndFeedTypeWithCursor(userId, feedType, cursorTime, pageable)
                    .getContent();
        } else {
            return feedItemRepo.findByUserIdAndFeedTypeWithCursor(userId, feedType,
                    LocalDateTime.now(), pageable).getContent();
        }
    }

    /**
     * Add item to feed
     */
    public void addToFeed(String userId, String contentId, ContentType contentType, FeedType feedType) {
        try {
            FeedItem feedItem = new FeedItem(userId, contentId, contentType, feedType);
            feedItemRepo.save(feedItem);

            // Clear cache for this user's feed
            clearFeedCache(userId, feedType);

            log.info("Added item to feed: userId={}, contentId={}, feedType={}",
                    userId, contentId, feedType);
        } catch (Exception e) {
            log.error("Error adding item to feed", e);
            throw new RuntimeException("Failed to add item to feed", e);
        }
    }

    /**
     * Add to multiple feeds async
     */
    @Async
    public CompletableFuture<Void> addToMultipleFeeds(List<String> userIds, String contentId,
                                                      ContentType contentType, FeedType feedType) {
        return CompletableFuture.runAsync(() -> {
            List<FeedItem> feedItems = userIds.stream()
                    .map(userId -> new FeedItem(userId, contentId, contentType, feedType))
                    .collect(Collectors.toList());

            feedItemRepo.saveAll(feedItems);

            // Clear cache for affected users
            userIds.forEach(userId -> clearFeedCache(userId, feedType));

            log.info("Added item to {} feeds: contentId={}, feedType={}",
                    userIds.size(), contentId, feedType);
        });
    }

    // Helper methods
    private FeedResponse buildFeedResponse(List<FeedItemDto> items, FeedType feedType, int limit) {
        String nextCursor = null;
        boolean hasMore = items.size() >= limit;

        if (hasMore && !items.isEmpty()) {
            FeedItemDto lastItem = items.get(items.size() - 1);
            nextCursor = lastItem.getCreatedAt().toString();
        }

        return new FeedResponse(items, nextCursor, hasMore, feedType.name());
    }

    private String buildCacheKey(String userId, FeedType feedType, String cursor, int limit) {
        return String.format("feed:%s:%s:%s:%d", userId, feedType,
                cursor != null ? cursor : "latest", limit);
    }

    private FeedResponse getCachedFeed(String cacheKey) {
        try {
            return (FeedResponse) redisTemplate.opsForValue().get(cacheKey);
        } catch (Exception e) {
            log.warn("Error getting cached feed: {}", cacheKey, e);
            return null;
        }
    }

    private void cacheFeed(String cacheKey, FeedResponse response) {
        try {
            redisTemplate.opsForValue().set(cacheKey, response, CACHE_TTL);
        } catch (Exception e) {
            log.warn("Error caching feed: {}", cacheKey, e);
        }
    }

    private void clearFeedCache(String userId, FeedType feedType) {
        String pattern = String.format("feed:%s:%s:*", userId, feedType);
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            log.warn("Error clearing feed cache for user: {}", userId, e);
        }
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    @Transactional
    public void cleanupOldFeedItems() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        int deletedCount = feedItemRepo.deleteOldFeedItems("", threshold);
        log.info("Cleaned up {} old feed items", deletedCount);
    }
}