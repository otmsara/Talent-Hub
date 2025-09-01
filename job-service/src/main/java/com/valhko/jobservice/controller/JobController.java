package com.valhko.jobservice.controller;

import com.valhko.jobservice.model.Job;
import com.valhko.jobservice.service.JobService;
import com.valhko.jobservice.service.UserValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final UserValidationService userValidationService;

    @PostMapping
    public ResponseEntity<Job> createJob(
            @RequestBody Job job,
            @RequestHeader(value = "Authorization", required = false) String authToken) {
        if (authToken == null) {
            System.out.println("DEV MODE: Creating job without authentication");
        }
        return ResponseEntity.ok(jobService.createJob(job, authToken));
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<Job>> getJobFeed(
            @RequestParam(required = false) Job.JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(jobService.getJobFeed(status, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-company")
    public ResponseEntity<List<Job>> getCompanyJobs(
            @RequestParam Long companyId,
            @RequestHeader(value = "Authorization", required = false) String authToken) {
        return ResponseEntity.ok(jobService.getCompanyJobs(companyId, authToken));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody Job update,
            @RequestParam Long companyId,
            @RequestHeader("Authorization") String authToken) {
        return ResponseEntity.ok(jobService.updateJob(id, update, companyId, authToken));
    }

    @GetMapping("/public/feed")
    public ResponseEntity<Page<Job>> getPublicJobFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(jobService.getJobFeed(Job.JobStatus.OPEN, pageable));
    }
}