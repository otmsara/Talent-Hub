package com.valhko.mediaservice.storage;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Blob {
    private String fileName;
    private String containerName;
    private String storageName;
    private String url;
    private Long size;
}
