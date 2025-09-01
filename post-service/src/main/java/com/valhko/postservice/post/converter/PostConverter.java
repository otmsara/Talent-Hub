package com.valhko.postservice.post.converter;

import com.valhko.postservice.contribution.converter.ContributionConverter;
import com.valhko.postservice.neededcontributor.converter.NeededContributorConverter;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.dto.request.PostCreateRequestDto;
import com.valhko.postservice.post.dto.request.PostUpdateRequestDto;
import com.valhko.postservice.post.dto.response.PostDto;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostConverter {
    private final ContributionConverter contributionConverter;
    private final NeededContributorConverter neededContributorConverter;

    public Post convert(PostCreateRequestDto dto) {
        Post entity = new Post();
        BeanUtils.copyProperties(dto, entity);
        entity.setIsNetworkingOnly(Boolean.parseBoolean(dto.getIsNetworkingOnly()));
        if (dto.getNeededContributors() != null)
            entity.setNeededContributors(dto.getNeededContributors().stream().map(neededContributorConverter::convert).toList());

        return entity;
    }

    public Post convert(PostUpdateRequestDto dto) {
        Post entity = new Post();
        BeanUtils.copyProperties(dto, entity);
        if (dto.getIsNetworkingOnly() != null) {
            entity.setIsNetworkingOnly(Boolean.parseBoolean(dto.getIsNetworkingOnly()));
        }
        if (dto.getNeededContributors() != null)
            entity.setNeededContributors(dto.getNeededContributors().stream().map(neededContributorConverter::convert).toList());
        return entity;
    }

    public PostDto convert(Post entity) {
        PostDto postDto = new PostDto();

        // If deleted, returns post id only, we need it to show comments and shares
        if (entity.isDeleted()) {
            postDto.setId(entity.getId());
            postDto.setDeleted(entity.isDeleted());
            return postDto;
        }

        BeanUtils.copyProperties(entity, postDto);

        postDto.setCommentsCount(entity.getComments().size());
        postDto.setAgreeCount(entity.getAgrees().size());
        postDto.setDisagreeCount(entity.getDisagrees().size());

        if (entity.getOriginalPost() != null)
            postDto.setOriginalPost(this.convert(entity.getOriginalPost()));

        postDto.setNeededContributors(entity.getNeededContributors().stream().map(neededContributorConverter::convert).toList());
        postDto.setContributions(entity.getContributions().stream().map(contributionConverter::convert).toList());
        postDto.setSharedPostsCount(entity.getSharedPosts().size());
        return postDto;
    }

}
