package com.valhko.common.client.userservice;

import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.system.dto.response.Result;
import com.valhko.common.system.util.StatusCode;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(value = "user-service")
public interface UserServiceClient {
    @GetMapping("/internal/users/{id}")
    @CircuitBreaker(name = "user", fallbackMethod = "findByIdFallback")
    Result<UserInternalDto> findById(@PathVariable String id);

    @GetMapping("/internal/users")
    @CircuitBreaker(name = "user", fallbackMethod = "findByIdsFallback")
    Result<List<UserInternalDto>> findByIds(@RequestParam List<String> ids);

    @GetMapping("/internal/networks/networking/exists")
    @CircuitBreaker(name = "user", fallbackMethod = "existsByNetworkedIdAndNetworkingIdFallback")
    Result<Boolean> existsByNetworkedIdAndNetworkingId(@RequestParam String currentUser, @RequestParam String otherUser);

    @GetMapping("/internal/networks/networking/exists/in")
    @CircuitBreaker(name = "user", fallbackMethod = "findByNetworkedIdAndNetworkingIdInFallback")
    Result<Map<String, Boolean>> findByNetworkedIdAndNetworkingIdIn(@RequestParam String currentUser, @RequestParam Set<String> users);

    @GetMapping("/internal/networks/{userId}/networking")
    @CircuitBreaker(name = "user", fallbackMethod = "getNetworkingFallback")
    Result<List<String>> getNetworking(@PathVariable String userId);

    default Result<UserInternalDto> findByIdFallback(String id, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), null);
    }

    default Result<List<UserInternalDto>> findByIdsFallback(List<String> ids, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), List.of());
    }

    default Result<Boolean> existsByNetworkedIdAndNetworkingIdFallback(String currentUser, String otherUser, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), false);
    }

    default Result<Map<String, Boolean>> findByNetworkedIdAndNetworkingIdInFallback(String currentUser, Set<String> users, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), new HashMap<>());
    }

    default Result<List<String>> getNetworkingFallback(String userId, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), List.of());
    }
}
