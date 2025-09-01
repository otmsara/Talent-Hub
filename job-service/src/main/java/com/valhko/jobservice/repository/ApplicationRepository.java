package com.valhko.jobservice.repository;

import com.valhko.jobservice.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(String userId);
    List<Application> findByJobId(Long jobId);
    boolean existsByUserIdAndJobId(String userId, Long jobId);

    @Query("SELECT a FROM Application a JOIN Job j ON a.jobId = j.id WHERE j.companyId = :companyId")
    Page<Application> findByCompanyId(Long companyId, Pageable pageable);

    @Query("SELECT a FROM Application a JOIN Job j ON a.jobId = j.id WHERE j.companyId = :companyId AND a.phase = :phase")
    Page<Application> findByCompanyIdAndPhase(Long companyId, Application.ApplicationPhase phase, Pageable pageable);
}