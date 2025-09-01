package com.valhko.common.client.postservice;

import com.valhko.common.system.dto.response.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.xml.stream.events.Characters;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@FeignClient(value = "post-service")
public interface PostServiceClient {
    @GetMapping("/internal/posts")
    Result<List<Map<String, Object>>> getPostsByIds(@RequestParam List<String> contentIds, @RequestParam String userId);

    @GetMapping("/internal/posts/users")
    Result<List<String>> getPostsIdsFromUsers(@RequestParam List<String> followingIds, @RequestParam LocalDateTime since);

    @PostMapping("/internal/posts/search")
    Result<List<Map<String, Object>>> findByCriteria(@RequestBody Map<String, String> criteria, @RequestParam String userId);
}
