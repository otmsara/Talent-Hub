package com.valhko.userservice.badgerequest;

import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.badgerequest.converter.BadgeRequestConverter;
import com.valhko.userservice.badgerequest.dto.request.BadgeRequestCreateDto;
import com.valhko.userservice.badgerequest.dto.request.BadgeRequestUpdateDto;
import com.valhko.userservice.badgerequest.dto.response.BadgeRequestDto;
import com.valhko.userservice.badgerequest.enricher.BadgeRequestDtoEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/badges/requests")
@RequiredArgsConstructor
public class BadgeRequestWeb {
    private final BadgeRequestConverter converter;
    private final BadgeRequestService service;
    private final BadgeRequestDtoEnricher enricher;

    @GetMapping("/me")
    public Result<Page<BadgeRequestDto>> me(Pageable pageable) {
        var items = service.getCurrentUserBadges(pageable);
        var dtoList = items.map(converter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result<BadgeRequestDto> create(@Valid @RequestBody BadgeRequestCreateDto dto) {
        var item = converter.convert(dto);
        var savedDto = converter.convert(service.create(item));
        enricher.enrich(item, savedDto);
        return Result.success(savedDto);
    }

    @GetMapping
    public Result<Page<BadgeRequestDto>> findAll(Pageable pageable) {
        var items = service.findAll(pageable);
        var dtoList = service.findAll(pageable).map(converter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @PatchMapping("/{id}")
    public Result<?> update(@PathVariable String id, @Valid @RequestBody BadgeRequestUpdateDto dto) {
        var item = converter.convert(dto);
        service.update(id, item);
        return Result.success();
    }
}
