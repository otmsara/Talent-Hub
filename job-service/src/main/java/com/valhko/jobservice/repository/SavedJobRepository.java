package com.valhko.jobservice.repository;

import com.valhko.jobservice.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUserId(String userId);
    boolean existsByUserIdAndJobId(String userId, Long jobId);

    @Transactional
    @Modifying
    @Query("DELETE FROM SavedJob s WHERE s.userId = :userId AND s.jobId = :jobId")
    void deleteByUserIdAndJobId(String userId, Long jobId);
}