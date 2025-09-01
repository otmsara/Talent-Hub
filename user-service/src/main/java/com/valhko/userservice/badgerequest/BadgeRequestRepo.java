package com.valhko.userservice.badgerequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeRequestRepo extends JpaRepository<BadgeRequest, String> {
    Page<BadgeRequest> findByRequesterId(String requesterId, Pageable pageable);
}
