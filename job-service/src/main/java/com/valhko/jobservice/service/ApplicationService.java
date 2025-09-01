package com.valhko.jobservice.service;

import com.valhko.jobservice.exception.AlreadyAppliedException;
import com.valhko.jobservice.model.Application;
import com.valhko.jobservice.model.Job;
import com.valhko.jobservice.repository.ApplicationRepository;
import com.valhko.jobservice.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserValidationService userValidationService;

    public Application createApplication(Application application, String authToken) {
        if (!userValidationService.validateUserExists(application.getUserId(), authToken)) {
            throw new RuntimeException("User not found");
        }

        if (applicationRepository.existsByUserIdAndJobId(application.getUserId(), application.getJobId())) {
            throw new AlreadyAppliedException("User has already applied to this job");
        }

        application.setStatus(Application.ApplicationStatus.PENDING);
        application.setPhase(Application.ApplicationPhase.APPLICATION);

        return applicationRepository.save(application);
    }

    public List<Application> getUserApplications(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public Page<Application> getCompanyApplications(Long companyId, Application.ApplicationPhase phase, Pageable pageable, String authToken) {

        userValidationService.getCurrentUserCompanyId(authToken);

        if (phase != null) {
            return applicationRepository.findByCompanyIdAndPhase(companyId, phase, pageable);
        }
        return applicationRepository.findByCompanyId(companyId, pageable);
    }

    public Application updateApplication(Long id, Application update, Long companyId, String authToken) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized to update this application");
        }

        // Valider les transitions de phase
        if (update.getPhase() != null) {
            validatePhaseTransition(application.getPhase(), update.getPhase());
            application.setPhase(update.getPhase());
        }

        if (update.getStatus() != null) {
            application.setStatus(update.getStatus());
        }

        return applicationRepository.save(application);
    }

    private void validatePhaseTransition(Application.ApplicationPhase current, Application.ApplicationPhase newPhase) {

        if (current == Application.ApplicationPhase.APPLICATION &&
                newPhase == Application.ApplicationPhase.OFFER) {
            throw new RuntimeException("Cannot jump directly from APPLICATION to OFFER");
        }
    }
}