package com.valhko.feedservice.feeditem.dto.response;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedResponse implements Serializable {
    private List<FeedItemDto> items;
    private String nextCursor;
    private boolean hasMore;
    private String feedType;
    private LocalDateTime generatedAt;

    public FeedResponse(List<FeedItemDto> items, String nextCursor, boolean hasMore, String feedType) {
        this.items = items;
        this.nextCursor = nextCursor;
        this.hasMore = hasMore;
        this.feedType = feedType;
        this.generatedAt = LocalDateTime.now();
    }
}