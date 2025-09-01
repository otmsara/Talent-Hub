package com.valhko.userservice.user.dto.response;

import com.valhko.userservice.badge.dto.response.BadgeDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEssentialsDto {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String avatarUrl;
    private String title;
    private List<BadgeDto> badges;
}
