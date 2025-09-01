package com.valhko.feedservice.feeditem;

import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.dto.response.Result;
import com.valhko.feedservice.feeditem.dto.response.FeedResponse;
import com.valhko.feedservice.feeditem.util.FeedType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/feeds")
@RequiredArgsConstructor
public class FeedWeb {

    private final FeedService feedService;
    private final FeedGenerationService feedGenerationService;

    @GetMapping
    public Result<FeedResponse> getFeed(
            @RequestParam(defaultValue = "ALL") FeedType type,
            @RequestParam(required = false) String cursor,
            @RequestParam(required = false) Integer limit) {

            FeedResponse response = feedService.getFeed(type, cursor, limit);
            return Result.success(response);
    }

    @PostMapping("/refresh")
    public Result<?> refreshFeed(
            @RequestParam String feedType) {
        FeedType type = FeedType.valueOf(feedType.toUpperCase());
        feedGenerationService.generateFeedAsync(UserContextHolder.userId(), type);
        return Result.success();
    }
}