package com.valhko.postservice.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {

    Report create(Report item);

    Page<Report> findByItemId(String postId, Pageable pageable);

    Page<Report> findByUserId(String userId, Pageable pageable);

    Page<Report> findAll(Pageable pageable);
}