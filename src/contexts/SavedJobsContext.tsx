"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

export interface JobPosting {
  id: number;
  job_title: string;
  job_description: string | null;
  company: string;
  location: string;
  level: string;
  match_score: number;
  description: string;
  key_responsibilities: string | null;
  required_qualifications: string | null;
  preferred_qualifications: string | null;
  benefits: string | null;
  salary: string | null;
  application_instructions: string | null;
  date_posted: string | null;
}

interface SavedJobsContextType {
  savedJobs: JobPosting[];
  isJobSaved: (jobId: number) => boolean;
  toggleSavedJob: (job: JobPosting) => void;
  addSavedJob: (job: JobPosting) => void;
  removeSavedJob: (jobId: number) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType>({
  savedJobs: [],
  isJobSaved: () => false,
  toggleSavedJob: () => {},
  addSavedJob: () => {},
  removeSavedJob: () => {},
});

export const useSavedJobs = () => useContext(SavedJobsContext);

export const SavedJobsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [savedJobs, setSavedJobs] = useState<JobPosting[]>([]);

  // Load from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedJobsFromStorage = localStorage.getItem("savedJobs");
        if (savedJobsFromStorage) {
          setSavedJobs(JSON.parse(savedJobsFromStorage));
        }
      } catch (error) {
        console.error("Failed to parse saved jobs from localStorage", error);
        setSavedJobs([]);
      }
    }
  }, []);

  // Save to localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    }
  }, [savedJobs]);

  const isJobSaved = (jobId: number) => {
    return savedJobs.some((job) => job.id === jobId);
  };

  const toggleSavedJob = (job: JobPosting) => {
    if (isJobSaved(job.id)) {
      removeSavedJob(job.id);
    } else {
      addSavedJob(job);
    }
  };

  const addSavedJob = (job: JobPosting) => {
    setSavedJobs((prev) => [...prev, job]);
  };

  const removeSavedJob = (jobId: number) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        isJobSaved,
        toggleSavedJob,
        addSavedJob,
        removeSavedJob,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
};
