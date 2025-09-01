package com.valhko.userservice.auth;

import com.valhko.common.system.auth.dto.SsoLoginRequest;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.userservice.auth.response.AuthResponse;
import com.valhko.userservice.role.Role;
import com.valhko.userservice.user.User;
import com.valhko.userservice.user.UserRepo;
import com.valhko.userservice.user.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.Date;

@RequiredArgsConstructor
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Token validity in milliseconds (e.g., 1 hour)
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private final UserService userService;
    private final UserRepo userRepo;

    @Override
    public AuthResponse authenticateAndGenerateToken(String email, String password) {
        // Delegate to the user service for verification
        User user = userService.verifyCredentials(email, password);
        if (user == null) {
            throw new InvalidArgumentsException("Invalid email or password");
        }
        // Build and return the JWT token
        String token = generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public String processGrantCode(String code) {
        return "";
    }

    @Override
    public AuthResponse ssoLogin(SsoLoginRequest request) {
        var user = userRepo.findByEmail(request.getEmail())
                .orElse(null);
        if (user == null) {
            user = userService.register(User.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .provider(request.getProvider())
                    .providerId(request.getProviderId())
                    .build());
        }
        return new AuthResponse(generateToken(user));
    }

    private String generateToken(User user) {
        var key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        // Create a JWT token
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .claim("roles", user.getRoles().stream().map(Role::getName).toList())
                .claim("userId", user.getId())
                .claim("disabled", user.getDisabled())
                .signWith(key)
                .compact();
    }
}
