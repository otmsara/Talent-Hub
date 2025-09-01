package com.valhko.userservice.badgerequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BadgeRequestService {
    BadgeRequest create(BadgeRequest item);

    Page<BadgeRequest> findAll(Pageable pageable);

    BadgeRequest update(String id, BadgeRequest item);

    Page<BadgeRequest> getCurrentUserBadges(Pageable pageable);
}
