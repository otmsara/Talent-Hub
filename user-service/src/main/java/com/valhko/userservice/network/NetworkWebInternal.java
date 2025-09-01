package com.valhko.userservice.network;

import com.valhko.common.system.dto.response.Result;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/internal/networks")
@RequiredArgsConstructor
public class NetworkWebInternal {
    private final NetworkRepo repo;

    @GetMapping("/networking/exists")
    public Result<Boolean> existsByNetworkedIdAndNetworkingId(@RequestParam String currentUser, @RequestParam String otherUser) {
        boolean value = repo.existsByNetworkedIdAndNetworkingId(currentUser, otherUser);
        return Result.success(value);
    }

    @GetMapping("/networking/exists/in")
    public Result<Map<String, Boolean>> findByNetworkedIdAndNetworkingId(@RequestParam String currentUser, @RequestParam Set<String> users) {
        var value = repo.findByNetworkedIdAndNetworkingIdInDefault(currentUser, users);
        return Result.success(value);
    }

    @GetMapping("/{userId}/networking")
    Result<List<String>> getNetworking(@PathVariable String userId) {
        var value = repo.findByNetworkedId(userId);
        var items = value.stream().map(e -> e.getNetworking().getId()).toList();
        return Result.success(items);
    }
}
