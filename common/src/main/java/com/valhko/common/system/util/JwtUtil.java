package com.valhko.common.system.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
@Slf4j
@ConditionalOnProperty(prefix = "common.util", name = "jwt.enabled", havingValue = "true")
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public Optional<Claims> validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            log.warn("JWT token is missing or does not start with Bearer");
            return Optional.empty();
        }
        String actualToken = token.substring(7); // Remove "Bearer " prefix

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(actualToken)
                    .getBody();

            // Optional: Check expiration more explicitly if needed
            if (claims.getExpiration() != null && claims.getExpiration().before(new Date())) {
                log.warn("JWT token is expired: {}", actualToken);
                return Optional.empty();
            }

            // Optional: Validate issuer, audience etc.
            // if (!"my-auth-server".equals(claims.getIssuer())) { ... }

            log.debug("JWT token validated successfully for subject: {}", claims.getSubject());
            return Optional.of(claims);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
            log.error("JWT token validation failed: {}", e.getMessage());
        }
        return Optional.empty();
    }

    public String getUserIdFromClaims(Claims claims) {
        return claims.get("userId", String.class);
    }
}