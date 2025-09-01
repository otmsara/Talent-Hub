package com.valhko.userservice.client.media;

import com.valhko.userservice.client.media.dto.response.MediaResponse;
import com.valhko.userservice.system.config.FeignMultipartSupportConfig;
import com.valhko.userservice.client.media.dto.request.SingleFileUploadRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "media-service", configuration = FeignMultipartSupportConfig.class)
public interface MediaServiceClient {
    @PostMapping(value = "v1/internal/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<MediaResponse> uploadSingleFile(@ModelAttribute SingleFileUploadRequest request);
}
