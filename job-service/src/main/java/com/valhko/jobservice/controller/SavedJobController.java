package com.valhko.jobservice.controller;

import com.valhko.jobservice.model.SavedJob;
import com.valhko.jobservice.service.SavedJobService;
import com.valhko.jobservice.service.UserValidationService;
import org.springframework.web.bind.annotation.RequestHeader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs/saved")
@RequiredArgsConstructor
public class SavedJobController {
    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJob> saveJob(
            @RequestParam String userId,
            @PathVariable Long jobId,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        if (authToken == null) {
            authToken = "dev-bypass-token";
        }

        return ResponseEntity.ok(savedJobService.saveJob(userId, jobId));
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(@RequestParam String userId) {
        return ResponseEntity.ok(savedJobService.getUserSavedJobs(userId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> removeSavedJob(
            @RequestParam String userId,
            @PathVariable Long jobId) {
        savedJobService.removeSavedJob(userId, jobId);
        return ResponseEntity.noContent().build();
    }
}