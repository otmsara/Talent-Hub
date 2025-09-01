package com.valhko.common.client.media.dto.response;

import com.valhko.common.client.media.util.MediaItemType;
import com.valhko.common.client.media.util.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MediaInternalDto {
    private String id;
    private String fileName;
    private String originalFileName;
    private String contentType;
    private String extension;
    private String itemId;
    private MediaItemType itemType;
    private MediaType type;
    private String containerName;
    private String storageName;
    private String url;
    private Long size;
    private String uploadedBy;
    private LocalDateTime createdAt;
}
