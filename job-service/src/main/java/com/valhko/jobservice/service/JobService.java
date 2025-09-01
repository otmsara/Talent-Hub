package com.valhko.jobservice.service;

import com.valhko.jobservice.model.Job;
import com.valhko.jobservice.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final UserValidationService userValidationService;

    public Job createJob(Job job, String authToken) {
        if (job.getCompanyId() != null) {
            userValidationService.getUserInfo(String.valueOf(job.getCompanyId()), authToken);
        }
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public List<Job> getCompanyJobs(Long companyId, String authToken) {
        userValidationService.getCurrentUserCompanyId(authToken);
        return jobRepository.findByCompanyId(companyId);
    }

    public Job updateJob(Long id, Job update, Long companyId, String authToken) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.isOwnedByCompany(companyId)) {
            throw new RuntimeException("Unauthorized to update this job");
        }

        if (update.getTitle() != null) job.setTitle(update.getTitle());
        if (update.getDescription() != null) job.setDescription(update.getDescription());
        if (update.getStatus() != null) {
            validateStatusTransition(job.getStatus(), update.getStatus());
            job.setStatus(update.getStatus());
        }

        return jobRepository.save(job);
    }

    private void validateStatusTransition(Job.JobStatus current, Job.JobStatus newStatus) {
        if (current == Job.JobStatus.CLOSED && newStatus != Job.JobStatus.CLOSED) {
            throw new RuntimeException("Cannot reopen a closed job");
        }
    }

    public Page<Job> getJobFeed(Job.JobStatus status, Pageable pageable) {
        if (status != null) {
            return jobRepository.findByStatus(status, pageable);
        }
        return jobRepository.findAll(pageable);
    }
}