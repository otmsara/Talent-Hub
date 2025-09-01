package com.valhko.chatservice.system.interceptor;

import lombok.NonNull;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class CustomHandshakeInterceptor implements HandshakeInterceptor {
    public final String X_USER_ID_HEADER = "X-User-Id";
    public static final String WS_SESSION_ATTR_USER_ID = "userId";

    @Override
    public boolean beforeHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, @NonNull WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            var httpServletRequest = servletRequest.getServletRequest();

            String userId = httpServletRequest.getHeader(X_USER_ID_HEADER);

            if (userId != null && !userId.trim().isBlank()) {
                attributes.put(WS_SESSION_ATTR_USER_ID, userId);
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(@NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response, @NonNull WebSocketHandler wsHandler, Exception exception) {

    }
}
