package com.valhko.postservice.post;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.post.converter.PostConverter;
import com.valhko.postservice.post.dto.request.PostCreateRequestDto;
import com.valhko.postservice.post.dto.request.PostUpdateRequestDto;
import com.valhko.postservice.post.dto.response.PostDto;
import com.valhko.postservice.post.enricher.PostDtoEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
public class PostWeb {
    private final PostService service;
    private final PostConverter converter;
    private final PostDtoEnricher postDtoEnricher;

    @GetMapping("/{id}")
    public Result<PostDto> findById(@PathVariable String id) {
        var post = service.findById(id);
        var dto = converter.convert(post);
        postDtoEnricher.enrich(post, dto);
        return Result.success(dto);
    }

    @PostMapping
    public Result<PostDto> create(@Valid @RequestBody PostCreateRequestDto dto) {
        var post = service.create(converter.convert(dto));
        var postDto = converter.convert(post);
        postDtoEnricher.enrich(post, postDto);
        return Result.success(postDto);
    }

    @PostMapping("/{postId}/share")
    public Result<PostDto> sharePost(@PathVariable String postId, @RequestParam(required = false) String content) {
        var post = service.sharePost(postId, content);
        var dto = converter.convert(post);
        postDtoEnricher.enrich(post, dto);
        return Result.success(dto);
    }

    @PutMapping("/{id}")
    public Result<PostDto> update(@PathVariable String id, @Valid @RequestBody PostUpdateRequestDto dto) {
        Post item = converter.convert(dto);
        Post updatedPost = service.update(id, item);
        PostDto updatedDto = converter.convert(updatedPost);
        postDtoEnricher.enrich(updatedPost, updatedDto);
        return Result.success(updatedDto);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable String id) {
        service.delete(id);
        return Result.success();
    }

    @PostMapping("/search")
    public Result<Page<PostDto>> findByCriteria(@RequestBody Map<String, String> criteria, Pageable pageable) {
        Page<Post> postPage = service.findByCriteria(criteria, pageable);
        Page<PostDto> postDtoPage = postPage.map(converter::convert);
        postDtoEnricher.enrich(postPage, postDtoPage);
        return Result.success(postDtoPage);
    }

    @GetMapping("/my-projects-contributions")
    public Result<Page<PostDto>> myProjectsContributions(Pageable pageable) {
        Page<Post> postPage = service.myProjectsContributions(pageable);
        Page<PostDto> postDtoPage = postPage.map(converter::convert);
        postDtoEnricher.enrich(postPage, postDtoPage);
        return Result.success(postDtoPage);
    }
}
