package com.valhko.mediaservice.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public interface MediaRepo extends JpaRepository<Media, String> {
    List<Media> findByIdIn(Set<String> ids);

    List<Media> findByItemIdIn(Set<String> idsSet);

    @Modifying
    @Query("UPDATE Media SET itemId = :itemId WHERE id IN :mediaIds")
    void updateItemIdWhereIdIn(String itemId, List<String> mediaIds);
}