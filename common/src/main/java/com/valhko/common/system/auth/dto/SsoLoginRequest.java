package com.valhko.common.system.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SsoLoginRequest {
    private String providerId;
    private String email;
    private String firstName;
    private String lastName;
    private String provider;
}
