package com.valhko.userservice.user.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

@Data
public class UserUpdateRequestDto {
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Size(min = 5, max = 20, message = "Username must be between 5 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$",
            message = "Username must start and end with an alphanumeric character, " +
                    "can contain '.', '_', '-' (not consecutively), and be 5-20 characters long.")
    private String username;

    @Size(max = 150, message = "Bio must not exceed 150 characters")
    private String bio;

    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters")
    private String title;

    @Size(min = 2, max = 30, message = "Country must be between 2 and 30 characters")
    private String country;

    @Size(min = 2, max = 30, message = "City must be between 2 and 30 characters")
    private String city;

    @Size(min = 2, max = 30, message = "Job company must be between 2 and 30 characters")
    private String jobCompany;

    @URL(protocol = "https", message = "Avatar URL must be a valid HTTPS URL")
    @Size(max = 2048, message = "Avatar URL must not exceed 2048 characters")
    private String avatarUrl;

    @Size(max = 1000, message = "Preferences must not exceed 1000 characters")
    private String preferences;

    @Past(message = "Birth date must be a date in the past")
    private LocalDate birthDate;

    @URL(protocol = "https", message = "Banner image URL must be a valid HTTPS URL")
    @Size(max = 2048, message = "Banner image URL must not exceed 2048 characters")
    private String bannerImageUrl;
}
