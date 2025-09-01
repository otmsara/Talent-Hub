package com.valhko.common.client.media;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MediaClientService {
    private final MediaClient mediaClient;

    public List<MediaInternalDto> findByItemIds(List<String> ids) {
        List<MediaInternalDto> emptyList = List.of();
        if (ids == null || ids.isEmpty())
            return emptyList;
        var result = mediaClient.findByItemIds(ids);
        if (result.isFlag())
            return result.getData();
        return emptyList;
    }

    public void updateItemIdWhereIdIn(String itemId, List<String> mediaIds) {
        if (mediaIds != null && !mediaIds.isEmpty())
            mediaClient.updateItemIdWhereIdIn(itemId, mediaIds);
    }
}
