package com.valhko.postservice.post;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.post.converter.PostConverter;
import com.valhko.postservice.post.dto.response.PostDto;
import com.valhko.postservice.post.enricher.PostDtoEnricher;
import com.valhko.postservice.post.util.PostStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/internal/posts")
@RequiredArgsConstructor
public class PostWebInternal {
    private final PostRepo repo;
    private final PostConverter converter;
    private final PostDtoEnricher enricher;
    private final PostService service;

    @GetMapping
    Result<List<PostDto>> getPostsByIds(@RequestParam List<String> contentIds, @RequestParam String userId) {
        var items = repo.findByIdIn(contentIds);
        var dtoList = items.stream().map(converter::convert).toList();
        enricher.enrich(items, dtoList, userId);
        return Result.success(dtoList);
    }

    @GetMapping("/users")
    Result<List<String>> getPostsIdsFromUsers(@RequestParam List<String> followingIds, @RequestParam LocalDateTime since) {
        var items = repo.findByPostedByIdInAndStatusAndCreatedAtGreaterThanEqual(followingIds, PostStatus.PUBLIC, since).stream().map(Post::getId).toList();
        return Result.success(items);
    }

    @PostMapping("/search")
    public Result<List<PostDto>> findByCriteria(@RequestBody Map<String, String> criteria, @RequestParam String userId) {
        var items = service.findByCriteria(criteria, userId);
        var dtoList = items.stream().map(converter::convert).toList();
        enricher.enrich(items, dtoList, userId);
        return Result.success(dtoList);
    }
}
