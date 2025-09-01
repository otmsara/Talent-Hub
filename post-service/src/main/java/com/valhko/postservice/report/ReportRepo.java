package com.valhko.postservice.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, String> {
    boolean existsByItemIdAndReportedById(String itemId, String userId);
    
    Page<Report> findByItemId(String itemId, Pageable pageable);
    
    Page<Report> findByReportedById(String userId, Pageable pageable);
}