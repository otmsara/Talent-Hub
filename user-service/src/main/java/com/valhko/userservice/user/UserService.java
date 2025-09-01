package com.valhko.userservice.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface UserService {
    User register(User user);

    User getMe();

    User getProfile(String username);

    Page<User> getNetworkingList(String userId, Pageable pageable);

    Page<User> getNetworkedList(String userId, Pageable pageable);

    Page<User> findByCriteria(Map<String, String> searchCriteria, Pageable pageable);

    User verifyCredentials(String email, String password);

    User update(User user);

    void updatePassword(String oldPassword, String newPassword, String confirmPassword);

    User findById(String userId);

    User findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    Page<User> getSuggestions(Pageable pageable);

    void updateUserStatus(String userId, Boolean active);
}