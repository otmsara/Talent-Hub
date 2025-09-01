package com.valhko.postservice.post.dto.request;

import com.valhko.postservice.neededcontributor.dto.response.NeededContributorDto;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.util.List;

@Data
public class PostCreateRequestDto {
    @NotNull(message = "The type is required")
    private PostType type;
    @NotBlank(message = "The content is required")
    @Size(max = 10000, message = "The content cannot be more than 10000 characters")
    private String content;
    @NotNull(message = "The status is required")
    private PostStatus status;
    private List<NeededContributorDto> neededContributors;
    private List<String> mediaIds;
    private String isNetworkingOnly;
    @URL
    private String link;
}
