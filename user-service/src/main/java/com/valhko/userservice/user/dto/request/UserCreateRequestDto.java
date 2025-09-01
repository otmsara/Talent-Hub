package com.valhko.userservice.user.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserCreateRequestDto {
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Size(min = 2, message = "First name must be at least 2 characters long")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Size(min = 2, message = "Last name must be at least 2 characters long")
    private String lastName;

    @NotBlank(message = "Password is required")
    @Size(max = 30, message = "Password must not exceed 30 characters")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;
}