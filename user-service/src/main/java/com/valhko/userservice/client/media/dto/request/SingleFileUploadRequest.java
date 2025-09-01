package com.valhko.userservice.client.media.dto.request;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class SingleFileUploadRequest {
    private MultipartFile file;
    private String type;
    private String itemType;
    private String itemId;
    private String uploadedBy;
}