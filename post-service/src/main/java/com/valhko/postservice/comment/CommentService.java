package com.valhko.postservice.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    Page<Comment> findByPostId(String postId, Pageable pageable);

    Comment create(Comment item);

    Comment update(String id, Comment item);

    Page<Comment> findByParentId(String parentId, Pageable pageable);

    void delete(String id);
}
