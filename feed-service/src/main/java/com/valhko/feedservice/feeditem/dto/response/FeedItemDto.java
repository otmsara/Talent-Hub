package com.valhko.feedservice.feeditem.dto.response;

import com.valhko.feedservice.feeditem.FeedItem;
import com.valhko.feedservice.feeditem.util.ContentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedItemDto {
    private String id;
    private String contentId;
    private ContentType contentType;
    private LocalDateTime createdAt;
    private Double score;
    private Object content;

    public FeedItemDto(FeedItem feedItem) {
        this.id = feedItem.getId();
        this.contentId = feedItem.getContentId();
        this.contentType = feedItem.getContentType();
        this.createdAt = feedItem.getCreatedAt();
        this.score = feedItem.getScore();
    }
}