package com.valhko.postservice.contribution.dto.request;

import com.valhko.postservice.neededcontributor.dto.response.NeededContributorDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ContributionCreateRequestDto {
    @NotBlank(message = "Post ID is required")
    private String postId;
    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content cannot be more than 10000 characters")
    private String content;
    @NotNull(message = "Needed contributor id is required")
    private NeededContributorDto neededContributor;
    private List<String> attachmentsIds;
}
