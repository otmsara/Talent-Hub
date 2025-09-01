package com.valhko.userservice.auth;

import com.valhko.common.system.auth.dto.SsoLoginRequest;
import com.valhko.userservice.auth.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/auth")
@RequiredArgsConstructor
public class AuthWebInternal {

    private final AuthenticationService service;

    @PostMapping("/sso-login")
    public AuthResponse ssoLogin(@RequestBody SsoLoginRequest request) {
        return service.ssoLogin(request);
    }
}
