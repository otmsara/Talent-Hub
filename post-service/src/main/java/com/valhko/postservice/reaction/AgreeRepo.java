package com.valhko.postservice.reaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface AgreeRepo extends JpaRepository<Agree, String> {
    boolean existsByActivityIdAndUserId(String activityId, String userId);

    Optional<Agree> findByActivityIdAndUserId(String activityId, String userId);

    @Query("SELECT a.activityId FROM Agree a WHERE a.userId = :userId AND a.activityId IN :postIds AND a.activityType = 0")
    Set<String> findPostIdsByUserIdAndPostIdIn(@Param("userId") String userId, @Param("postIds") Set<String> postIds);

    // Delete works with query only somehow
    @Modifying
    @Query("DELETE Agree WHERE activityId = :activityId AND userId = :userId")
    int deleteByActivityIdAndUserId(@Param("activityId") String activityId, @Param("userId") String userId);

    @Query("SELECT a.activityId FROM Agree a WHERE a.userId = :userId AND a.activityId IN :commentIds AND a.activityType = 1")
    Set<String> findCommentIdsByUserIdAndCommentIdIn(@Param("userId") String userId, @Param("commentIds") Set<String> commentIds);
}
