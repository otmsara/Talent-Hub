package com.valhko.userservice.auth;

import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.auth.request.AuthRequest;
import com.valhko.userservice.auth.response.AuthResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/users/auth")
public class AuthWeb {

    private final AuthenticationService authService;

    @PostMapping("/login")
    public Result<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        return Result.success(
                authService.authenticateAndGenerateToken(authRequest.getEmail(), authRequest.getPassword())
        );
    }

    @GetMapping("/google")
    public String grantCode(@RequestParam("code") String code, @RequestParam("scope") String scope, @RequestParam("authuser") String authUser, @RequestParam("prompt") String prompt) {
        return authService.processGrantCode(code);
    }
}
