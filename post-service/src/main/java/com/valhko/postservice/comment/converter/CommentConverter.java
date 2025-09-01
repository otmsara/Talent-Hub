package com.valhko.postservice.comment.converter;

import com.valhko.postservice.comment.Comment;
import com.valhko.postservice.comment.dto.request.CommentCreateRequestDto;
import com.valhko.postservice.comment.dto.request.CommentUpdateRequestDto;
import com.valhko.postservice.comment.dto.response.CommentDto;
import com.valhko.postservice.post.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentConverter {
    public Comment convert(CommentCreateRequestDto dto) {
        Comment item = new Comment();
        BeanUtils.copyProperties(dto, item);
        item.setPost(Post.builder().id(dto.getPostId()).build());
        if (dto.getParentId() != null)
            item.setParent(Comment.builder().id(dto.getParentId()).build());
        return item;
    }

    public Comment convert(CommentUpdateRequestDto dto) {
        Comment item = new Comment();
        BeanUtils.copyProperties(dto, item);
        return item;
    }

    public CommentDto convert(Comment item) {
        CommentDto response = new CommentDto();
        response.setParent(item.getParent() == null ? null : item.getParent().getId());
        response.setRepliesCount(item.getReplies().size());
        // If item is deleted, then shows only id, parentId and totalReplies
        if (item.isDeleted()) {
            response.setId(item.getId());
            response.setDeleted(item.isDeleted());
            return response;
        }
        BeanUtils.copyProperties(item, response);
        response.setParent(item.getParent() == null ? null : item.getParent().getId());
        response.setAgreeCount(item.getAgreeCount());

        return response;
    }

}
