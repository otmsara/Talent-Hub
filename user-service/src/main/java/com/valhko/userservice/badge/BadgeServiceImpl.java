package com.valhko.userservice.badge;

import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.userservice.badge.util.BadgeStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeServiceImpl implements BadgeService{
    private final BadgeRepo repo;

    @Override
    public List<Badge> getMyBadges() {
        return repo.findByOwnerId(UserContextHolder.userId());
    }

    @Override
    @Transactional
    public void update(String id, Badge item) {
        var foundItem = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The badge was not found."));

        if (!foundItem.getOwner().getId().equals(UserContextHolder.userId()))
            throw new ForbiddenRequestException("You are not the owner of this badge.");

        if (item.getStatus().equals(BadgeStatus.ACTIVE)) {
            var userBadges = repo.findByOwnerId(UserContextHolder.userId());
            userBadges.forEach(e -> e.setStatus(BadgeStatus.INACTIVE));
            repo.saveAll(userBadges);
        }

        foundItem.setStatus(item.getStatus());

        repo.save(foundItem);
    }
}
