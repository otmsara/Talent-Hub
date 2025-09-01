package com.valhko.userservice.badgerequest.dto.request;

import com.valhko.userservice.badge.util.BadgeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class BadgeRequestCreateDto {
    @NotNull(message = "The type is required")
    private BadgeType type;
    @NotBlank(message = "The content is required")
    private String content;
    @Size(min = 1, message = "You have to include at one attachment")
    private List<String> attachmentsIds;
}
