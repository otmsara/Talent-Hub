package com.valhko.userservice.client.media.dto.response;

import com.valhko.userservice.user.util.MediaItemType;
import com.valhko.userservice.user.util.MediaType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MediaResponse {
    private String id;
    private String fileName;
    private String itemId;
    private MediaType type;
    private MediaItemType itemType;
    private String url;
    private LocalDateTime createdAt;
}
