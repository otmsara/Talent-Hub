package com.valhko.userservice.badgerequest;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.userservice.badge.Badge;
import com.valhko.userservice.badge.BadgeRepo;
import com.valhko.userservice.badgerequest.util.BadgeRequestStatus;
import com.valhko.userservice.user.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeRequestServiceImpl implements BadgeRequestService {
    private final BadgeRequestRepo repo;
    private final UserRepo userRepo;
    private final BadgeRepo badgeRepo;
    private final MediaClientService mediaClientService;

    @Override
    @Transactional
    public BadgeRequest create(BadgeRequest item) {
        var user = userRepo.findById(UserContextHolder.userId())
                .orElseThrow(() -> new RuntimeException("The user was not found!"));

        item.setRequester(user);

        BadgeRequest saved = repo.save(item);

        updateMedia(item.getAttachmentsIds(), saved.getId());

        return saved;
    }

    @Override
    public Page<BadgeRequest> findAll(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    @Transactional
    public BadgeRequest update(String id, BadgeRequest item) {
        var foundItem = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The badge request was not found."));

        if (foundItem.isDone())
            throw new InvalidArgumentsException("This request is already done!");

        if (item.getStatus().equals(BadgeRequestStatus.ACCEPTED)) {
            var badge = Badge.builder()
                    .type(foundItem.getType())
                    .owner(foundItem.getRequester())
                    .validUntil(item.getValidUntil())
                    .build();
            badgeRepo.save(badge);
        }

        foundItem.setDone(true);
        foundItem.setStatus(item.getStatus());
        foundItem.setValidUntil(item.getValidUntil());

        updateMedia(item.getAttachmentsIds(), foundItem.getId());

        return repo.save(foundItem);
    }

    private void updateMedia(List<String> mediaIds, String postId) {
        mediaClientService.updateItemIdWhereIdIn(postId, mediaIds);
    }

    @Override
    public Page<BadgeRequest> getCurrentUserBadges(Pageable pageable) {
        System.out.println(UserContextHolder.userId());
        return repo.findByRequesterId(UserContextHolder.userId(), pageable);
    }
}
