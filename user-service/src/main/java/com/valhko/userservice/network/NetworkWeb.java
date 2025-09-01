package com.valhko.userservice.network;

import com.valhko.common.system.dto.response.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/networks")
@RequiredArgsConstructor
public class NetworkWeb {
    private final NetworkService service;

    @PostMapping
    public Result<?> connect(@RequestParam String userId) {
        service.connect(userId);
        return Result.success();
    }

    @DeleteMapping
    public Result<?> disconnect(@RequestParam String userId) {
        service.disconnect(userId);
        return Result.success();
    }
}
