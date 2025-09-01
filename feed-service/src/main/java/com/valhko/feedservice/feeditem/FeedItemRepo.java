package com.valhko.feedservice.feeditem;

import com.valhko.feedservice.feeditem.util.FeedType;
import io.micrometer.observation.annotation.Observed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

@Observed
public interface FeedItemRepo extends JpaRepository<FeedItem, String> {
    
    @Query("SELECT f FROM FeedItem f WHERE f.userId = :userId AND f.feedType = :feedType " +
           "AND f.createdAt < :cursor ORDER BY f.createdAt DESC")
    Page<FeedItem> findByUserIdAndFeedTypeWithCursor(
        @Param("userId") String userId,
        @Param("feedType") FeedType feedType,
        @Param("cursor") LocalDateTime cursor,
        Pageable pageable
    );
    
    @Query("SELECT f FROM FeedItem f WHERE f.userId = :userId AND f.feedType = :feedType " +
           "ORDER BY f.score DESC, f.createdAt DESC")
    Page<FeedItem> findByUserIdAndFeedTypeOrderByScore(
        @Param("userId") String userId,
        @Param("feedType") FeedType feedType,
        Pageable pageable
    );
    
    /*@Query("SELECT f FROM FeedItem f WHERE f.userId = :userId AND f.authorId IN :followingIds " +
           "AND f.createdAt > :since ORDER BY f.createdAt DESC")
    List<FeedItem> findRecentItemsFromFollowing(
        @Param("userId") String userId,
        @Param("followingIds") List<String> followingIds,
        @Param("since") LocalDateTime since
    );
     */
    
    @Modifying
    @Query("DELETE FROM FeedItem f WHERE f.userId = :userId AND f.createdAt < :threshold")
    int deleteOldFeedItems(@Param("userId") String userId, @Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT COUNT(f) FROM FeedItem f WHERE f.userId = :userId AND f.feedType = :feedType")
    long countByUserIdAndFeedType(@Param("userId") String userId, @Param("feedType") FeedType feedType);
}