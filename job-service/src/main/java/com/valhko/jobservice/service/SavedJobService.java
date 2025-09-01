package com.valhko.jobservice.service;

import com.valhko.jobservice.exception.AlreadySavedException;
import com.valhko.jobservice.model.SavedJob;
import com.valhko.jobservice.repository.JobRepository;
import com.valhko.jobservice.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobService {
    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    public SavedJob saveJob(String userId, Long jobId) {

        jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new AlreadySavedException("Job already saved by user");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setUserId(userId);
        savedJob.setJobId(jobId);

        return savedJobRepository.save(savedJob);
    }

    public List<SavedJob> getUserSavedJobs(String userId) {
        return savedJobRepository.findByUserId(userId);
    }

    public void removeSavedJob(String userId, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }
}