package com.valhko.postservice.contribution.converter;

import com.valhko.postservice.contribution.Contribution;
import com.valhko.postservice.contribution.dto.request.ContributionCreateRequestDto;
import com.valhko.postservice.contribution.dto.request.ContributionUpdateRequestDto;
import com.valhko.postservice.contribution.dto.response.ContributionDto;
import com.valhko.postservice.neededcontributor.converter.NeededContributorConverter;
import com.valhko.postservice.post.Post;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContributionConverter {
    private final NeededContributorConverter neededContributorConverter;

    public Contribution convert(ContributionCreateRequestDto dto) {
        Contribution entity = new Contribution();
        BeanUtils.copyProperties(dto, entity);
        entity.setPost(Post.builder().id(dto.getPostId()).build());
        entity.setNeededContributor(neededContributorConverter.convert(dto.getNeededContributor()));
        return entity;
    }

    public Contribution convert(ContributionUpdateRequestDto dto) {
        Contribution entity = new Contribution();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public ContributionDto convert(Contribution item) {
        ContributionDto response = new ContributionDto();
        BeanUtils.copyProperties(item, response);
        response.setPostId(item.getPost().getId());
        response.setNeededContributor(neededContributorConverter.convert(item.getNeededContributor()));
        return response;
    }
}
