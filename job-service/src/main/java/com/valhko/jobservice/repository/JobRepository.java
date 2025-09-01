package com.valhko.jobservice.repository;

import com.valhko.jobservice.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);
}