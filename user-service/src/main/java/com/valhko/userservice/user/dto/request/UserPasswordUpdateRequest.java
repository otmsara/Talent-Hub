package com.valhko.userservice.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserPasswordUpdateRequest {

    @NotBlank(message = "The old password is required")
    private String oldPassword;

    @NotBlank(message = "The new password is required")
    @Size(max = 30, message = "Must not exceed 30 characters")
    @Size(min = 8, message = "Must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
    private String newPassword;

    @NotBlank(message = "The confirm password is required")
    @Size(max = 30, message = "Must not exceed 30 characters")
    @Size(min = 8, message = "Must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
    private String confirmPassword;
}
