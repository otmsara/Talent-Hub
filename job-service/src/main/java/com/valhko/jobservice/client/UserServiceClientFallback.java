package com.valhko.jobservice.client;

import com.valhko.jobservice.dto.UserResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
public class UserServiceClientFallback implements UserServiceClient {

    @Override
    public UserResponse getUserById(String userId) {
        log.warn("Fallback: Returning mock user for id {}", userId);
        return createMockUser(userId);
    }

    @Override
    public Boolean checkUserExists(String userId) {
        log.warn("Fallback: Assuming user {} exists for development", userId);
        return true;
    }

    @Override
    public UserResponse getCurrentUser() {
        log.warn("Fallback: Returning mock current user");
        return createMockUser("123");
    }

    private UserResponse createMockUser(String userId) {
        UserResponse mockUser = new UserResponse();
        mockUser.setId(userId);
        mockUser.setEmail("mock.user@email.com");
        mockUser.setFirstName("Mock");
        mockUser.setLastName("User");
        mockUser.setJobCompany("Mock Company (1)");
        mockUser.setActive(true);
        mockUser.setDisabled(false);

        return mockUser;
    }
}