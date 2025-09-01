package com.valhko.postservice.post.dto.response;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.postservice.contribution.dto.response.ContributionDto;
import com.valhko.postservice.neededcontributor.dto.response.NeededContributorDto;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDto {
    private String id;
    private UserInternalDto postedBy;
    private PostType type;
    private PostStatus status;
    private Boolean isNetworkingOnly;
    private Integer commentsCount;
    private Integer agreeCount;
    private Integer disagreeCount;
    private List<NeededContributorDto> neededContributors;
    private List<ContributionDto> contributions;
    private List<MediaInternalDto> media;
    private String content;
    private String link;
    private Boolean isAgreed = false;
    private Boolean isDisagreed = false;
    private Boolean deleted = false;
    private PostDto originalPost;
    private Integer sharedPostsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
