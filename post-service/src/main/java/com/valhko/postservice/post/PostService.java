package com.valhko.postservice.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface PostService {
    Post create(Post item);

    Post findById(String id);

    Post update(String id, Post item);

    void delete(String id);

    List<Post> findByCriteria(Map<String, String> criteria, String userId);

    Post sharePost(String postId, String content);

    Page<Post> findByCriteria(Map<String, String> criteria, Pageable pageable);

    Page<Post> myProjectsContributions(Pageable pageable);
}
