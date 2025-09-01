package com.valhko.mediaservice.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    Blob uploadFile(MultipartFile file, String containerName) throws IOException;

    void delete(String containerName, String fileName);
}
