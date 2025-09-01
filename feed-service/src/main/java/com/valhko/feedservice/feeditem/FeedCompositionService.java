package com.valhko.feedservice.feeditem;

import com.valhko.common.client.postservice.post.PostClientService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.feedservice.feeditem.dto.response.FeedItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FeedCompositionService {
    
    private final PostClientService postClientService;
    
    public List<FeedItemDto> enrichFeedItems(List<FeedItem> feedItems) {
        if (feedItems.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Extract content and author IDs
        List<String> contentIds = feedItems.stream()
            .map(FeedItem::getContentId)
            .distinct()
            .collect(Collectors.toList());

        var contentFuture =
            CompletableFuture.supplyAsync(() -> fetchContent(contentIds, feedItems.getFirst().getUserId()));

        var contentMap = contentFuture.join();
        
        // Enrich feed items
        return feedItems.stream()
            .map(item -> {
                var dto = new FeedItemDto(item);
                dto.setContent(contentMap.get(item.getContentId()));
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    private Map<String, Object> fetchContent(List<String> contentIds, String userId) {
        try {
            // Assuming posts for now, could be extended for other content types
            var posts = postClientService.getPostsByIds(contentIds, userId);
            var map = new HashMap<String, Object>();
            posts.forEach(e -> {
                map.put((String) e.get("id"), e);
            });
            return map;
        } catch (Exception e) {
            log.error("Error fetching content", e);
            return Collections.emptyMap();
        }
    }
}