package com.valhko.mediaservice.media;

import com.valhko.common.system.dto.response.Result;
import com.valhko.mediaservice.media.converter.MediaConverter;
import com.valhko.mediaservice.media.dto.response.MediaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/v1/media")
@RequiredArgsConstructor
public class MediaWeb {
    private final MediaService service;
    private final MediaConverter converter;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<List<MediaDto>> create(MultipartFile[] files) {
        List<Media> mediaList = service.create(files);
        return Result.success(mediaList.stream().map(converter::convert).toList());
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable String id) {
        service.delete(id);
        return Result.success();
    }
}
