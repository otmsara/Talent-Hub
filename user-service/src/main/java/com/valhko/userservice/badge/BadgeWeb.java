package com.valhko.userservice.badge;

import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.badge.converter.BadgeConverter;
import com.valhko.userservice.badge.dto.request.BadgeUpdateDto;
import com.valhko.userservice.badge.dto.response.BadgeDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/badges")
@RequiredArgsConstructor
public class BadgeWeb {
    private final BadgeService service;
    private final BadgeConverter converter;

    @GetMapping("/me")
    public Result<List<BadgeDto>> getMyBadges() {
        return Result.success(service.getMyBadges().stream().map(converter::convert).toList());
    }

    @PatchMapping("/{id}")
    public Result<?> update(@PathVariable String id, @Valid @RequestBody BadgeUpdateDto dto) {
        var item = converter.convert(dto);
        service.update(id, item);
        return Result.success();
    }
}
