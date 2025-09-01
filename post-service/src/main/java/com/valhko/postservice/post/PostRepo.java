package com.valhko.postservice.post;

import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface PostRepo extends JpaRepository<Post, String>, JpaSpecificationExecutor<Post> {
    boolean existsById(@NonNull String id);

    Page<Post> findByStatusAndDeleted(PostStatus status, Pageable pageable, boolean isDeleted);

    Page<Post> findByPostedByIdAndStatusIsNotIn(Pageable pageable, String userId, Set<PostStatus> status);

    List<Post> findByPostedByIdInAndStatusAndCreatedAtGreaterThanEqual(List<String> users, PostStatus status, LocalDateTime since);

    Page<Post> findByContentContainingIgnoreCaseAndStatusAndType(String keyword, PostStatus status, PostType type, Pageable pageable);

    Page<Post> findByContentContainingIgnoreCaseAndStatus(String keyword, PostStatus status, Pageable pageable);

    List<Post> findByIdIn(List<String> contentIds);

    Page<Post> findByContributionsUserId(String userId,
                                         Pageable pageable);
}
