package com.valhko.postservice.comment;

import com.valhko.postservice.comment.util.CommentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, String> {
    Page<Comment> findByPostIdAndParentId(Pageable pageable, String postId, String parentId);

    Page<Comment> findByParentIdAndType(Pageable pageable, String parentId, CommentType type);
}
