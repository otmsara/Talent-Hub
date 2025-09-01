package com.valhko.userservice.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateStatusRequestDto {
    @NotBlank(message = "The user id is required")
    private String userId;

    @NotNull(message = "The status is required")
    private Boolean active;
}
