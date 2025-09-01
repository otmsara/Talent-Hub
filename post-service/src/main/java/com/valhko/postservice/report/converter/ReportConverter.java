package com.valhko.postservice.report.converter;

import com.valhko.postservice.report.Report;
import com.valhko.postservice.report.dto.request.ReportCreateRequestDto;
import com.valhko.postservice.report.dto.response.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportConverter {
    public ReportDto convert(Report entity) {
        ReportDto dto = new ReportDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public Report convert(ReportCreateRequestDto dto) {
        Report entity = new Report();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }
}