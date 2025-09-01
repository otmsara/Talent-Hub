package com.valhko.userservice.auth;

import com.valhko.common.system.auth.dto.SsoLoginRequest;
import com.valhko.userservice.auth.response.AuthResponse;

public interface AuthenticationService {
    AuthResponse authenticateAndGenerateToken(String username, String password);

    String processGrantCode(String code);

    AuthResponse ssoLogin(SsoLoginRequest request);
}