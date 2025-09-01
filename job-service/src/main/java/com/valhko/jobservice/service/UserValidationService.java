package com.valhko.jobservice.service;

import com.valhko.jobservice.client.UserServiceClient;
import com.valhko.jobservice.dto.UserResponse;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserValidationService {

    // Gardez les paramètres authToken mais ignorez-les
    public boolean validateUserExists(String userId, String authToken) {
        try {
            log.info("Bypassing user validation for development - user: {}", userId);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    public UserResponse getUserInfo(String userId, String authToken) {
        try {
            log.info("Returning mock user for development - user: {}", userId);
            UserResponse mockUser = new UserResponse();
            mockUser.setId(userId);
            mockUser.setFirstName("Mock");
            mockUser.setLastName("User");
            mockUser.setEmail("mock@example.com");
            return mockUser;
        } catch (Exception e) {
            throw new RuntimeException("Mock user created for development");
        }
    }

    public Long getCurrentUserCompanyId(String authToken) {
        log.info("Returning mock companyId for development");
        return 123L;
    }
}