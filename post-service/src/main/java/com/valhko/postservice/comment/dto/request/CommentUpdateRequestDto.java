package com.valhko.postservice.comment.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CommentUpdateRequestDto {
    @NotEmpty(message = "The comment is required")
    @Size(max = 500, message = "The content cannot be more than 500 characters")
    private String content;
    private List<String> mediaIds;
}
