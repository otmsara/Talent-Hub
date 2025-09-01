package com.valhko.userservice.badge;

import java.util.List;

public interface BadgeService {
    List<Badge> getMyBadges();

    void update(String id, Badge item);
}
