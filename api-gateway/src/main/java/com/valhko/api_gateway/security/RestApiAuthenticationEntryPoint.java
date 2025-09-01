package com.valhko.api_gateway.security;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class RestApiAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    /**
     * This method is called whenever an unauthenticated user tries to access a protected resource.
     * Instead of redirecting to a login page (the default), we return a 401 Unauthorized error.
     */
    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
        var response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // Optional: A custom error message in the response body
        String errorMessage = "{\"error\": \"Unauthorized\", \"message\": \"Authentication is required to access this resource.\"}";
        DataBuffer buffer = response.bufferFactory().wrap(errorMessage.getBytes(StandardCharsets.UTF_8));
        
        return response.writeWith(Mono.just(buffer));
    }
}