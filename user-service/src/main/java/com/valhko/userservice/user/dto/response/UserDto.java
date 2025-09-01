package com.valhko.userservice.user.dto.response;

import com.valhko.userservice.badge.dto.response.BadgeDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String preferences;
    private LocalDate birthDate;
    private BigDecimal balance;
    private Integer networking;
    private Integer networked;
    private String title;
    private String country;
    private String city;
    private String jobCompany;
    private String bannerImageUrl;
    private String provider;
    private String providerId;
    private Boolean disabled;
    private Boolean active;
    private List<BadgeDto> badges;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
