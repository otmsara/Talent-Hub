package com.valhko.mediaservice.media;

import com.valhko.common.client.media.util.MediaItemType;
import com.valhko.common.client.media.util.MediaType;
import com.valhko.mediaservice.storage.Blob;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(indexes = @Index(columnList = "itemId"))
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    @CreationTimestamp
    private LocalDateTime createdAt;

    public void update(Blob blob) {
        this.fileName = blob.getFileName();
        this.setUrl(blob.getUrl());
        this.setSize(blob.getSize());
        this.setContainerName(blob.getContainerName());
        this.setStorageName(blob.getStorageName());
    }

    public void update(MultipartFile file) {
        this.originalFileName = file.getOriginalFilename();
        this.contentType = file.getContentType();
        this.extension = Objects.requireNonNull(file.getOriginalFilename())
                .substring(file.getOriginalFilename().lastIndexOf(".") + 1);
    }
}
