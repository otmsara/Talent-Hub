package com.valhko.postservice.contribution;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContributionRepo extends JpaRepository<Contribution, String> {
    Page<Contribution> findByPostId(String postId, Pageable pageable);
    Page<Contribution> findByUserId(String userId, Pageable pageable);
    Page<Contribution> findByPostIdAndUserId(String postId, String userId, Pageable pageable);

    Optional<Contribution> findByIdAndUserId(String id, String userId);
    Integer deleteByIdAndUserId(String id, String userId);
}