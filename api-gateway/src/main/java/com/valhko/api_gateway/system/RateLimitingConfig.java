package com.valhko.api_gateway.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimitingConfig {
    private final JwtUtil jwtUtil;

    private static final Logger log = LoggerFactory.getLogger(RateLimitingConfig.class);

    public RateLimitingConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Rate limiting by IP address
     */
    @Bean
    @Primary
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
            String xRealIp = exchange.getRequest().getHeaders().getFirst("X-Real-IP");
            String remoteAddress = exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() 
                : "unknown";
            
            // Priority: X-Forwarded-For > X-Real-IP > Remote Address
            String clientIp = xForwardedFor != null ? xForwardedFor.split(",")[0].trim() 
                : (xRealIp != null ? xRealIp : remoteAddress);

            return Mono.just(clientIp);
        };
    }

    /**
     * Rate limiting by user ID (from JWT token)
     */
    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            if (userId != null) {
                return Mono.just(userId);
            }
            // Fallback to IP-based rate limiting
            return ipKeyResolver().resolve(exchange);
        };
    }
}