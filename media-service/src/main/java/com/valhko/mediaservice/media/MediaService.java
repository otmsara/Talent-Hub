package com.valhko.mediaservice.media;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface MediaService {
    List<Media> create(MultipartFile[] files);

    void delete(String id);

    List<Media> findByItemIds(Set<String> ids);

    void updateItemIdWhereIdIn(String id, List<String> mediaIds);
}
