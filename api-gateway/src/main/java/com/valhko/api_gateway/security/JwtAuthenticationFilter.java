package com.valhko.api_gateway.security;

import com.valhko.api_gateway.system.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.List;


@Component
public class JwtAuthenticationFilter implements WebFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    @SuppressWarnings("null")
    public Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String token = null;

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer "))
            token = authHeader.substring(7);

        String queryToken = exchange.getRequest().getQueryParams().getFirst("token");
        if (queryToken != null && !queryToken.isEmpty())
            token = queryToken;

        if (token == null)
            return chain.filter(exchange);

        try {
            Claims claims = jwtUtil.getClaims(token);

            // If token is valid, add user info into request headers
            String userId = claims.get("userId", String.class);
            String email = claims.getSubject();
            @SuppressWarnings("unchecked")
            String roles = String.join(",", claims.get("roles", List.class));

            UserDetails userDetails = new Principal(email, roles);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextImpl context = new SecurityContextImpl(authenticationToken);

            ServerHttpRequest mutatedRequest =
                    exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Email", email)
                            .header("X-User-Roles", roles)
                            .build();

            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(mutatedRequest)
                    .build();

            return chain.filter(mutatedExchange).contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(context)));
        } catch (RuntimeException e) {
            return chain.filter(exchange);
        }
    }
}
