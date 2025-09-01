package com.valhko.postservice.comment.dto.response;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDto {
    private String id;
    private String content;
    private UserInternalDto createdBy;
    private Integer agreeCount;
    private List<MediaInternalDto> media;
    private Boolean isAgreed;
    private Boolean isDisagreed;
    private Integer repliesCount;
    private String parent;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
