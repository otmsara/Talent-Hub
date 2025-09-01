package com.valhko.postservice.report;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.report.converter.ReportConverter;
import com.valhko.postservice.report.dto.request.ReportCreateRequestDto;
import com.valhko.postservice.report.dto.response.ReportDto;
import com.valhko.postservice.report.enricher.ReportDtoEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
public class ReportWeb {
    private final ReportService reportService;
    private final ReportConverter reportConverter;
    private final ReportDtoEnricher enricher;

    @GetMapping
    public Result<Page<ReportDto>> findAll(Pageable pageable) {
        var items = reportService.findAll(pageable);
        var dtoList = items.map(reportConverter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @PostMapping
    public Result<ReportDto> create(@Valid @RequestBody ReportCreateRequestDto dto) {
        var item = reportConverter.convert(dto);
        var savedItem = reportService.create(item);
        var savedDto = reportConverter.convert(savedItem);
        enricher.enrich(savedItem, savedDto);
        return Result.success(savedDto);
    }
}
