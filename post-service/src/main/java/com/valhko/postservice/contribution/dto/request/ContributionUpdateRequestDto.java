package com.valhko.postservice.contribution.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ContributionUpdateRequestDto {
    @NotBlank(message = "Content is required")
    @Size(max = 1000, message = "Content cannot be more than 1000 characters")
    private String content;
    private List<String> attachmentsIds;
}
