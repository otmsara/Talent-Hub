package com.valhko.postservice.comment;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.comment.converter.CommentConverter;
import com.valhko.postservice.comment.dto.request.CommentCreateRequestDto;
import com.valhko.postservice.comment.dto.request.CommentUpdateRequestDto;
import com.valhko.postservice.comment.dto.response.CommentDto;
import com.valhko.postservice.comment.enricher.CommentDtoEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/comments")
@RequiredArgsConstructor
public class CommentWeb {
    private final CommentService commentService;
    private final CommentConverter commentConverter;
    private final CommentDtoEnricher commentDtoEnricher;

    @GetMapping
    public Result<Page<CommentDto>> findByPostId(@RequestParam String postId, Pageable pageable) {
        Page<Comment> comments = commentService.findByPostId(postId, pageable);
        Page<CommentDto> commentsDto = comments.map(commentConverter::convert);
        commentDtoEnricher.enrich(comments, commentsDto);
        return Result.success(commentsDto);
    }

    @PostMapping
    public Result<CommentDto> create(@Valid @RequestBody CommentCreateRequestDto dto) {
        Comment newItem = commentConverter.convert(dto);
        Comment savedItem = commentService.create(newItem);
        CommentDto savedDto = commentConverter.convert(savedItem);
        commentDtoEnricher.enrich(savedItem, savedDto);
        return Result.success(savedDto);
    }

    @PutMapping("/{id}")
    public Result<CommentDto> update(@PathVariable String id, @Valid @RequestBody CommentUpdateRequestDto dto) {
        Comment item = commentConverter.convert(dto);
        Comment comment = commentService.update(id, item);
        CommentDto updatedDto = commentConverter.convert(comment);
        commentDtoEnricher.enrich(comment, updatedDto);
        return Result.success(updatedDto);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable String id) {
        commentService.delete(id);
        return Result.success();
    }

    @GetMapping("/{id}/replies")
    public Result<Page<CommentDto>> findRepliesByCommentId(@PathVariable String id, Pageable pageable) {
        Page<Comment> comments = commentService.findByParentId(id, pageable);
        Page<CommentDto> commentsDto = comments.map(commentConverter::convert);
        commentDtoEnricher.enrich(comments, commentsDto);
        return Result.success(commentsDto);
    }
}
