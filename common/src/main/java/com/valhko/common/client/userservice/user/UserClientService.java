package com.valhko.common.client.userservice.user;

import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.client.userservice.UserServiceClient;
import com.valhko.common.system.dto.response.Result;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserClientService {
    private final UserServiceClient userClient;

    public UserInternalDto findById(String id) {
        var result = userClient.findById(id);
        return result.getData();
    }

    public List<UserInternalDto> findByIds(List<String> ids) {
        return userClient.findByIds(ids).getData();
    }

    public String getUserInterests(String userId) {
        var user = userClient.findById(userId).getData();
        if (user == null) {
            return "";
        }
        return user.getPreferences();
    }
}
