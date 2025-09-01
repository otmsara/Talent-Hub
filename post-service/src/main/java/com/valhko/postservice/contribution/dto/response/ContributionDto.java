package com.valhko.postservice.contribution.dto.response;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.postservice.neededcontributor.dto.response.NeededContributorDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ContributionDto {
    private String id;
    private String postId;
    private UserInternalDto user;
    private String content;
    private NeededContributorDto neededContributor;
    private List<MediaInternalDto> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
