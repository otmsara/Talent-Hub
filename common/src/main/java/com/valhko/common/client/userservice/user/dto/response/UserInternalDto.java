package com.valhko.common.client.userservice.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInternalDto {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String avatarUrl;
    private String preferences;
    private Object badges;
}
