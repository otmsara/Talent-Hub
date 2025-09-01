package com.valhko.postservice.neededcontributor.converter;

import com.valhko.postservice.neededcontributor.NeededContributor;
import com.valhko.postservice.neededcontributor.dto.response.NeededContributorDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class NeededContributorConverter {
    public NeededContributor convert(NeededContributorDto dto) {
        NeededContributor entity = new NeededContributor();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public NeededContributorDto convert(NeededContributor item) {
        NeededContributorDto dto = new NeededContributorDto();
        BeanUtils.copyProperties(item, dto);
        return dto;
    }
}
