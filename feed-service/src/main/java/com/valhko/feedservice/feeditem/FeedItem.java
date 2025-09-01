package com.valhko.feedservice.feeditem;

import com.valhko.feedservice.feeditem.util.ContentType;
import com.valhko.feedservice.feeditem.util.FeedType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedItem {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String contentId; // Post ID, etc.
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContentType contentType;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "score")
    private Double score; // For ranking algorithm
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FeedType feedType;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON for additional data

    public FeedItem(String userId, String contentId, ContentType contentType, FeedType feedType) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.contentId = contentId;
        this.contentType = contentType;
        this.feedType = feedType;
        this.createdAt = LocalDateTime.now();
        this.score = 0.0;
    }
}