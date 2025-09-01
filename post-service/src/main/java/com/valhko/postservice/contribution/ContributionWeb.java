package com.valhko.postservice.contribution;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.contribution.converter.ContributionConverter;
import com.valhko.postservice.contribution.dto.request.ContributionCreateRequestDto;
import com.valhko.postservice.contribution.dto.request.ContributionUpdateRequestDto;
import com.valhko.postservice.contribution.dto.response.ContributionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/v1/contributions")
@RequiredArgsConstructor
public class ContributionWeb {
    private final ContributionService service;
    private final ContributionConverter converter;

    @GetMapping("/{id}")
    public Result<ContributionDto> findById(@PathVariable String id) {
        Contribution item = service.findById(id);
        return Result.success(converter.convert(item));
    }

    @PostMapping
    public Result<ContributionDto> create(@Valid @RequestBody ContributionCreateRequestDto dto) throws IOException {
        Contribution item = converter.convert(dto);
        return Result.success(converter.convert(service.create(item)));
    }

    @PutMapping(value = "/{id}")
    public Result<ContributionDto> update(@PathVariable String id, @Valid @RequestBody ContributionUpdateRequestDto dto) {
        Contribution item = converter.convert(dto);
        return Result.success(converter.convert(service.update(id, item)));
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable String id) {
        service.deleteById(id);
        return Result.success();
    }
}
