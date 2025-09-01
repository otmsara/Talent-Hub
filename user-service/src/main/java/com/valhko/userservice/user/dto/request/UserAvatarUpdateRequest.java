package com.valhko.userservice.user.dto.request;

import com.valhko.userservice.system.annotation.FileSize;
import com.valhko.userservice.system.annotation.FileType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserAvatarUpdateRequest {
    @NotNull(message = "The image is required")
    @FileType(message = "Invalid Image type", types = {"image/png", "image/jpeg"})
    @FileSize(max = 2, message = "Image size can not be greater than 2MB")
    private MultipartFile file;
}
