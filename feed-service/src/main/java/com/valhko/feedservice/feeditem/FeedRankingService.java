package com.valhko.feedservice.feeditem;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;
/*
@Service
public class FeedRankingService {

    // Simple ranking algorithm - in reality, this would be much more complex
    public List<Post> rankPosts(String userId, List<Post> posts) {
        return posts.stream()
            .sorted((p1, p2) -> Double.compare(
                calculateScore(userId, p2), 
                calculateScore(userId, p1)
            ))
            .collect(Collectors.toList());
    }
    
    public Double calculateScore(String userId, Post post) {
        // Simple scoring algorithm - would be replaced with ML model
        double score = 0.0;
        
        // Recency factor
        long hoursAgo = ChronoUnit.HOURS.between(post.getCreatedAt(), LocalDateTime.now());
        score += Math.max(0, 24 - hoursAgo) * 0.1;
        
        // Engagement factor (likes, comments, shares)
        score += post.getLikesCount() * 0.5;
        score += post.getCommentsCount() * 1.0;
        score += post.getSharesCount() * 2.0;
        
        // Author popularity
        // score += getAuthorFollowersCount(post.getUserId()) * 0.001;
        
        return score;
    }

}
 */