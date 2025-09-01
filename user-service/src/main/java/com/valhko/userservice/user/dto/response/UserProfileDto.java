package com.valhko.userservice.user.dto.response;

import com.valhko.userservice.badge.dto.response.BadgeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String bio;
    private Integer networking;
    private Integer networked;
    private String avatarUrl;
    public boolean isNetworking;
    public boolean isNetworked;
    public String title;
    public String country;
    public String city;
    public String jobCompany;
    private String bannerImageUrl;
    private List<BadgeDto> badges;
    public LocalDateTime createdAt;
}
