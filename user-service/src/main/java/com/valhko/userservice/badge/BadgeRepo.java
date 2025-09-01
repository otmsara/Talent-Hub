package com.valhko.userservice.badge;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BadgeRepo extends JpaRepository<Badge, String> {
    List<Badge> findByOwnerId(String id);
}
