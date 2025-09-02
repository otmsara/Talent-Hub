import React, { createContext, useContext, useState, ReactNode } from "react";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  logo?: string;
  posted?: string;
  minSalary?: string;
  maxSalary?: string;
  projectBased?: boolean;
  phases?: {
    title: string;
    description: string;
    deadline: string;
  }[];
};

export type ApplicationStatus = "submitted" | "in_review" | "phase2" | "phase3" | "hired" | "rejected";

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  coverLetter: string;
  resumeName: string;
  resumeFile?: File;
  phaseAnswer?: string;
  phaseFiles?: string[]; // file names or URLs
  submittedAt: string;
  status?: ApplicationStatus;
  phaseIndex?: number; // 0-based, for project-based jobs
};

const initialJobs: Job[] = [
  {
    id: "pb1",
    title: "UX Developer",
    company: "Valhko",
    location: "Remote",
    description:
      "Join our team as a UX Developer for a project-based recruitment process. The first phase will test your ability to design a user-friendly dashboard.",
    logo: "https://randomuser.me/api/portraits/men/32.jpg",
    posted: "just now",
    minSalary: "70000",
    maxSalary: "110000",
    projectBased: true,
    phases: [
      {
        title: "Phase 1: Dashboard Design Challenge",
        description: "Design a dashboard interface for our analytics platform. Submit your design files (Figma, PDF, or images) and a brief explanation of your design choices.",
        deadline: "2025-07-01"
      }
    ]
  },
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "AGI Corp",
    location: "Remote",
    description:
      "We are seeking a Senior Frontend Engineer to join our team. You will work on cutting-edge AI products and collaborate with world-class designers and engineers. Requirements: 5+ years experience, React, TypeScript, UI/UX skills.",
    logo: "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg",
    posted: "1 day ago",
    minSalary: "90000",
    maxSalary: "140000",
    projectBased: false,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "Luna Park",
    location: "San Francisco, CA",
    description:
      "Lead the product vision and execution for our next-gen SaaS platform. You will work closely with engineering, design, and marketing. Requirements: 3+ years PM experience, strong communication, agile methodologies.",
    logo: "https://randomuser.me/api/portraits/women/44.jpg",
    posted: "3 days ago",
    minSalary: "110000",
    maxSalary: "160000",
    projectBased: false,
  },
  {
    id: "3",
    title: "AI Research Scientist",
    company: "Sphere AI",
    location: "London, UK",
    description:
      "Join our research team to push the boundaries of artificial intelligence. Publish papers, attend conferences, and build real-world AI systems. Requirements: PhD or equivalent, deep learning, Python, publications.",
    logo: "https://i.pravatar.cc/150?img=11",
    posted: "5 days ago",
    minSalary: "100000",
    maxSalary: "180000",
    projectBased: false,
  },
];

type JobContextType = {
  jobs: Job[];
  addJob: (job: Job) => void;
  removeJob: (id: string) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>([]);

  const addJob = (job: Job) => {
    setJobs((prev) => [{ ...job, id: Date.now().toString(), posted: "just now" }, ...prev]);
  };

  const removeJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const addApplication = (app: Application) => {
    setApplications((prev) => [
      {
        ...app,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "submitted",
        phaseIndex: app.phaseIndex ?? 0,
      },
      ...prev,
    ]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const removeApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        removeJob,
        applications,
        addApplication,
        updateApplication,
        removeApplication,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobs must be used within a JobProvider");
  return ctx;
};
