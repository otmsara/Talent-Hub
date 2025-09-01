package com.valhko.jobservice.client;

import com.valhko.jobservice.config.FeignConfig;
import com.valhko.jobservice.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service",
        url = "${user.service.url:}",
        configuration = FeignConfig.class) // ← Ajoute la config
public interface UserServiceClient {

    @GetMapping("/v1/users/{userId}")
    UserResponse getUserById(@PathVariable("userId") String userId);

    @GetMapping("/v1/users/{userId}/exists")
    Boolean checkUserExists(@PathVariable("userId") String userId);

    @GetMapping("/v1/users/me")
    UserResponse getCurrentUser();
}