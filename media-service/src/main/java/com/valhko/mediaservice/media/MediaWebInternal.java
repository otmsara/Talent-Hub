package com.valhko.mediaservice.media;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.common.system.dto.response.Result;
import com.valhko.mediaservice.media.converter.MediaConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/internal/media")
@RequiredArgsConstructor
public class MediaWebInternal {
    private final MediaService mediaService;
    private final MediaConverter converter;

    @GetMapping
    public Result<List<MediaInternalDto>> findByItemIds(@RequestParam List<String> ids) {
        var items = mediaService.findByItemIds(new HashSet<>(ids));
        var dtoList = items.stream().map(converter::toInternalDto).toList();
        return Result.success(dtoList);
    }

    @PostMapping("/update/itemId")
    public Result<?> updateItemIdWhereIdIn(@RequestParam String itemId, @RequestParam List<String> mediaIds) {
        mediaService.updateItemIdWhereIdIn(itemId, mediaIds);
        return Result.success();
    }
}
