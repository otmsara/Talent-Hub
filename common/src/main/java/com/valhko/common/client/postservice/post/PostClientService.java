package com.valhko.common.client.postservice.post;

import com.valhko.common.client.postservice.PostServiceClient;
import com.valhko.common.system.dto.response.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostClientService {
    private final PostServiceClient postServiceClient;

    public List<String> getPostsIdsFromUsers(List<String> followingIds, LocalDateTime since) {
        return postServiceClient.getPostsIdsFromUsers(followingIds, since).getData();
    }

    public List<Map<String, Object>> getPostsByIds(List<String> contentIds, String userId) {
        return postServiceClient.getPostsByIds(contentIds, userId).getData();
    }

    @PostMapping("/internal/posts/search")
    public List<Map<String, Object>> findByCriteria(Map<String, String> criteria, String userId) {
        return postServiceClient.findByCriteria(criteria, userId).getData();
    }
}
