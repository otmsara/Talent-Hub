package com.valhko.mediaservice.storage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.PublicAccessType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AzureStorageService implements StorageService {
    private final BlobServiceClient blobServiceClient;

    @Value("${storage.name}")
    private String storageName;

    public AzureStorageService(
            @Value("${azure.storage.connection-string}") String connectionString) {
        // Initialize the BlobServiceClient using the connection string
        this.blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
    }

    @Override
    public Blob uploadFile(MultipartFile file, String containerName) throws IOException {
        BlobContainerClient client = blobServiceClient.getBlobContainerClient(containerName);
        if (!client.exists()) {
            client.create();
            client.setAccessPolicy(PublicAccessType.BLOB, null);
        }
        // Generate unique filename
        String uniqueFileName = generateFileName(file);
        // Upload the file
        BlobClient blobClient = client.getBlobClient(uniqueFileName);
        blobClient.upload(file.getInputStream(), file.getSize(), true);
        return Blob.builder()
                .fileName(blobClient.getBlobName())
                .containerName(blobClient.getContainerName())
                .storageName(storageName)
                .url(blobClient.getContainerName() + "/" + blobClient.getBlobName())
                .build();
    }

    @Override
    public void delete(String containerName, String fileName) {
        BlobContainerClient client = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = client.getBlobClient(fileName);
        blobClient.delete();
    }

    private String generateFileName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        // Get file extension (if any)
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return System.currentTimeMillis() + extension;
    }

}
