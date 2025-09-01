package com.valhko.common.client.media;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.system.dto.response.Result;
import com.valhko.common.system.util.StatusCode;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "media-service")
public interface MediaClient {
    @GetMapping("/internal/media")
    @CircuitBreaker(name = "media", fallbackMethod = "findByItemIdsFallback")
    Result<List<MediaInternalDto>> findByItemIds(@RequestParam List<String> ids);

    @PostMapping("/internal/media/update/itemId")
    @CircuitBreaker(name = " ", fallbackMethod = "updateItemIdWhereIdInFallback")
    Result<?> updateItemIdWhereIdIn(@RequestParam String itemId, @RequestParam List<String> mediaIds);

    @GetMapping("/internal/media/item/{id}")
    @CircuitBreaker(name = "media", fallbackMethod = "fallback")
    Result<List<MediaInternalDto>> findByItemId(@PathVariable String id);

    default Result<List<MediaInternalDto>> findByItemIdsFallback(List<String> ids, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), List.of());
    }

    default Result<?> updateItemIdWhereIdInFallback(String itemId, List<String> mediaIds, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage());
    }

    default Result<List<MediaInternalDto>> findByItemIdFallback(String id, Throwable throwable) {
        return new Result<>(false, StatusCode.SERVICE_UNAVAILABLE, throwable.getMessage(), List.of());
    }
}
