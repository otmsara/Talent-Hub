package com.valhko.userservice.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAvatarUpdateDto {
    private String avatarUrl;
}
