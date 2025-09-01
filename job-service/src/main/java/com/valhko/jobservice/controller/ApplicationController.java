package com.valhko.jobservice.controller;

import com.valhko.jobservice.model.Application;
import com.valhko.jobservice.service.ApplicationService;
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
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserValidationService userValidationService;

    @PostMapping
    public ResponseEntity<Application> createApplication(
            @RequestBody Application application,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        if (authToken == null) {
            authToken = "dev-bypass-token";
        }

        return ResponseEntity.ok(applicationService.createApplication(application, authToken));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getUserApplications(@RequestParam String userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>> getUserApplicationsById(
            @PathVariable String userId,
            @RequestHeader("Authorization") String authToken) {
        if (!userValidationService.validateUserExists(userId, authToken)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }

    @GetMapping("/for-my-company")
    public ResponseEntity<Page<Application>> getCompanyApplications(
            @RequestParam Long companyId,
            @RequestParam(required = false) Application.ApplicationPhase phase,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authToken) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(applicationService.getCompanyApplications(companyId, phase, pageable, authToken));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @RequestBody Application update,
            @RequestParam Long companyId,
            @RequestHeader("Authorization") String authToken) {
        return ResponseEntity.ok(applicationService.updateApplication(id, update, companyId, authToken));
    }
}