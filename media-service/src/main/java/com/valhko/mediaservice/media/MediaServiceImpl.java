package com.valhko.mediaservice.media;

import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.client.media.util.MediaType;
import com.valhko.mediaservice.storage.AzureStorageService;
import com.valhko.mediaservice.storage.Blob;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@Service
public class MediaServiceImpl implements MediaService {
    private final AzureStorageService storageService;
    private final MediaRepo repo;

    @Value("${file.max-image-size}")
    private long maxImageSize;
    @Value("${file.max-video-size}")
    private long maxVideoSize;
    @Value("${file.max-attachment_size}")
    private long maxAttachmentSize;
    @Value("${storage.containers.image-name}")
    private String imagesContainerName;
    @Value("${storage.containers.video-name}")
    private String videosContainerName;
    @Value("${storage.containers.attachment-name}")
    private String attachmentsContainerName;

    @Override
    @Transactional
    public List<Media> create(MultipartFile[] files) {
        if (files == null || files.length == 0) return Collections.emptyList();
        List<ValidatedResult> validatedResults = validate(files);
        try {
            for (ValidatedResult result : validatedResults) {
                Blob blob = storageService.uploadFile(result.file(), getContainerName(result.media().getType()));
                result.media().update(blob);
                result.media().setUploadedBy(UserContextHolder.userId());
            }
            List<Media> mediaList = validatedResults.stream().map(ValidatedResult::media).toList();
            return repo.saveAll(mediaList);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload files", e);
        }
    }

    @Override
    @Transactional
    public void delete(String id) {
        Media media = repo.findById(id).orElseThrow(() -> new RuntimeException("The media was not found."));
        media.setUploadedBy(UserContextHolder.userId());

        storageService.delete(media.getContainerName(), media.getFileName());
        repo.delete(media);
    }

    @Override
    public List<Media> findByItemIds(Set<String> ids) {
        return repo.findByItemIdIn(ids);
    }

    @Override
    @Transactional
    public void updateItemIdWhereIdIn(String id, List<String> mediaIds) {
        repo.updateItemIdWhereIdIn(id, mediaIds);
    }

    private List<ValidatedResult> validate(MultipartFile[] files) {
        List<ValidatedResult> validatedResults = new ArrayList<>();
        for (MultipartFile file : files) {
            Media media = new Media();
            if (file == null) throw new InvalidArgumentsException("File is null.");
            if (file.isEmpty()) throw new InvalidArgumentsException("File is empty: " + file.getOriginalFilename());
            if (file.getSize() == 0)
                throw new InvalidArgumentsException("File size is 0: " + file.getOriginalFilename());
            MediaType type = getType(file.getContentType());
            if (type == null)
                throw new InvalidArgumentsException("Unsupported file type: " + file.getOriginalFilename() +
                        ". Supported types: image, video, attachment (pdf, zip, rar).");
            validateSizeBasedOnType(file.getSize(), type);
            media.setType(type);
            media.update(file);
            validatedResults.add(new ValidatedResult(media, file));
        }
        return validatedResults;
    }

    private long mbToByte(long value) {
        return value * 1024 * 1024;
    }

    private MediaType getType(String contentType) {
        return switch (contentType) {
            case "image/jpeg", "image/jpg", "image/png", "image/webp" -> MediaType.IMAGE;
            case "video/mp4" -> MediaType.VIDEO;
            case "application/pdf", "application/zip", "application/x-rar-compressed" -> MediaType.ATTACHMENTS;
            default -> null;
        };
    }

    private void validateSizeBasedOnType(long size, MediaType mediaType) {
        switch (mediaType) {
            case IMAGE -> {
                if (size > mbToByte(maxImageSize))
                    throw new InvalidArgumentsException("The image size is greater than " + maxImageSize + " MB.");
            }
            case VIDEO -> {
                if (size > mbToByte(maxVideoSize))
                    throw new InvalidArgumentsException("The video size is greater than " + maxVideoSize + " MB.");
            }
            case ATTACHMENTS -> {
                if (size > mbToByte(maxAttachmentSize))
                    throw new InvalidArgumentsException("The attachment size is greater than " + maxAttachmentSize + " MB.");
            }
        }
    }

    private String getContainerName(MediaType mediaType) {
        return switch (mediaType) {
            case IMAGE -> imagesContainerName;
            case VIDEO -> videosContainerName;
            case ATTACHMENTS -> attachmentsContainerName;
        };
    }

    record ValidatedResult(Media media, MultipartFile file) {
    }
}
