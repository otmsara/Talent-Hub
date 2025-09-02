import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";
import { useResume } from "@/contexts/ResumeContext";
import { JobPosting, useSavedJobs } from "@/hooks/use-saved-jobs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import { MinimizedAgentIndicator } from "@/components/MinimizedAgentIndicator";

import {
  Bookmark,
  Building2,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  Zap,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AgentProgress, AgentState, AgentMessage } from "./AgentProgress";
import AnalyticsTabContent, { AnalyticsData } from "./AnalyticsTabContent";
import { CompanySearchTabContent } from "./CompanySearchTabContent";
import { CareerIntelligenceTabContent } from "./CareerIntelligenceTabContent";
import { CoverLetterTabContent } from "./CoverLetterTabContentProps";
import { DeepSearchTabContent } from "./DeepSearchTabContent";
import { InterviewPreparationTabContent } from "./InterviewPreparationTabContent";
import ResumeBuilderTabContent from "./ResumeBuilderTabContent";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { ResumeUploadDialog } from "./ResumeUploadDialog";
import { WorkspaceCard } from "./WorkspaceCard";
import { useUser } from "@/contexts/UserContext";
import useAuth from "../_hooks/useAuth";

interface WorkspaceContentProps {
  activeTab: string;
  onAgentComplete?: (agentId: string) => void;
  onAgentRunning?: (agentId: string) => void;
  onAgentStopped?: (agentId: string) => void;
  onTabChange?: (tabId: string) => void;
  onJobSelected?: (jobTitle: string) => void;
}

const AGENT_RESULT_KEY = (agent: string, jobId: string, userId: string) =>
  `arya_agent_result_${agent}_${jobId}_${userId}`;

const saveAgentResult = (
  agent: string,
  jobId: string,
  userId: string,
  data: any
) => {
  try {
    localStorage.setItem(
      AGENT_RESULT_KEY(agent, jobId, userId),
      JSON.stringify(data)
    );
  } catch {}
};

const loadAgentResult = (agent: string, jobId: string, userId: string) => {
  try {
    const raw = localStorage.getItem(AGENT_RESULT_KEY(agent, jobId, userId));
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

export const WorkspaceContent = (props: WorkspaceContentProps) => {
  const { auth: user } = useAuth();
  const { toast } = useToast();
  const { isJobSaved, toggleSavedJob } = useSavedJobs();
  const [showMinimizedAgentIndicator, setShowMinimizedAgentIndicator] =
    useState(false);
  const [agentStates, setAgentStates] = useState<
    Record<string, Record<string, AgentState>>
  >({});
  const [runningAgentsByJob, setRunningAgentsByJob] = useState<
    Record<string, string[]>
  >({});
  const [completedAgentsByJob, setCompletedAgentsByJob] = useState<
    Record<string, string[]>
  >({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [companyReportData, setCompanyReportData] = useState<
    Record<string, string>
  >({});
  const [interviewPrepData, setInterviewPrepData] = useState<
    Record<string, string>
  >({});
  const [coverLetterData, setCoverLetterData] = useState<
    Record<string, string>
  >({});
  const [careerIntelligenceData, setCareerIntelligenceData] = useState<
    Record<string, string>
  >({});
  const [minimizedIndicatorExpanded, setMinimizedIndicatorExpanded] =
    useState(false);
  const [deepSearchData, setDeepSearchData] = useState<Record<string, string>>({});
  const [resumeBuilderData, setResumeBuilderData] = useState<
    Record<string, string>
  >({});
  const [isResumeLoading, setIsResumeLoading] = useState<
    Record<string, boolean>
  >({});
  const [showResumeUploadDialog, setShowResumeUploadDialog] = useState(true);

  const { uploadedResumes, currentResume, addResume } = useResume();
  const [completedJobs, setCompletedJobs] = useState<Record<string, boolean>>({});
  const [jobListings, setJobListings] = useState<JobPosting[]>([]);
  const [completedAnalyticsJobs, setCompletedAnalyticsJobs] = useState<Set<string>>(new Set());

  const initialAgentStates: Record<string, AgentState> = {
    "deep-search": {
      jobId: "",
      running: false,
      agentName: "deep-search",
      progress: 0,
      status: "idle",
      messages: [],
    },
    "company-search": {
      jobId: "",
      running: false,
      agentName: "company-search",
      progress: 0,
      status: "idle",
      messages: [],
    },
    interview: {
      jobId: "",
      running: false,
      agentName: "interview",
      progress: 0,
      status: "idle",
      messages: [],
    },
    resume: {
      jobId: "",
      running: false,
      agentName: "resume",
      progress: 0,
      status: "idle",
      messages: [],
    },
    "cover-letter": {
      jobId: "",
      running: false,
      agentName: "cover-letter",
      progress: 0,
      status: "idle",
      messages: [],
    },
    analytics: {
      jobId: "",
      running: false,
      agentName: "analytics",
      progress: 0,
      status: "idle",
      messages: [],
    },
    "career-intelligence": {
      jobId: "",
      running: false,
      agentName: "career-intelligence",
      progress: 0,
      status: "idle",
      messages: [],
    },
  };

  const handleToggleMinimizedIndicator = (expanded: boolean) => {
    setMinimizedIndicatorExpanded(expanded);
  };

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && user && currentResume) {
      const key = `completed_jobs_${user.id}_${currentResume.file.name}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedJobs(JSON.parse(saved));
      }
    }
  }, [user, currentResume]);
  
  useEffect(() => {
    if (!user || !currentResume || jobListings.length === 0) return;
    console.log("jobListings:", jobListings);
    const agentTypes = [
      "company-search",
      "interview",
      "cover-letter",
      "deep-search",
      "resume",
      "analytics",
      "career-intelligence",
    ];

    jobListings.forEach((job) => {
      let hasAnyAgentData = false;
      agentTypes.forEach((agent) => {
        const data = loadAgentResult(agent, job.id, user.id);
        if (data) {
          hasAnyAgentData = true;
          switch (agent) {
            case "company-search":
              setCompanyReportData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
            case "interview":
              setInterviewPrepData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
            case "cover-letter":
              setCoverLetterData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
            case "deep-search":
              setDeepSearchData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
            case "resume":
              setResumeBuilderData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
            case "analytics":
              setAnalyticsData((prev) => ({
                ...prev,
                [job.id]: data,
              }));
              break;
              case "career-intelligence":
                setCareerIntelligenceData((prev) => ({
                  ...prev,
                  [job.id]: data,
                }));
                break;
          }
        }
      });
      if (hasAnyAgentData) {
        setCompletedJobs(prev => ({ ...prev, [job.id]: true }));
      }
    });
  }, [user, currentResume, jobListings]);

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== "undefined" && user && currentResume) {
      const key = `completed_analytics_jobs_${user.id}_${currentResume.file.name}`;
      localStorage.setItem(
        key,
        JSON.stringify(Array.from(completedAnalyticsJobs))
      );
    }
  }, [completedAnalyticsJobs, user, currentResume]);

  // Load job matches
  useEffect(() => {
    if (!currentResume || !user) return;

    const JOB_CACHE_KEY = `job_matches_${user.id}_${currentResume.file.name}`;
    const cached = localStorage.getItem(JOB_CACHE_KEY);
    if (cached) {
      setJobListings(JSON.parse(cached));
      return;
    }

    const fetchJobMatches = async () => {
      if (!currentResume) return;

      const formData = new FormData();
      const base64String = currentResume.file.content.split(",")[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: currentResume.file.type });
      formData.append("cv_file", blob, currentResume.file.name);

      try {
        const response = await axios.post(
          "https://arya-job-matching.azurewebsites.net/api/match-cv",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const processedData = processJobData(response.data);
          setJobListings(processedData);
          localStorage.setItem(JOB_CACHE_KEY, JSON.stringify(processedData));
        }
      } catch (error) {
        console.error("Failed to fetch job matches:", error);
      }
    };

    const debounceFetch = setTimeout(fetchJobMatches, 300);
    return () => clearTimeout(debounceFetch);
  }, [currentResume, user]);

  // Load agent results when job is selected
  useEffect(() => {
    if (!user || !selectedJobId) return;
    const agentTypes = [
      "company-search",
      "interview",
      "cover-letter",
      "deep-search",
      "resume",
      "analytics",
      "career-intelligence",
    ];
    let hasAnyAgentData = false;
    agentTypes.forEach((agent) => {
      const data = loadAgentResult(agent, selectedJobId, user.id);
      if (data) {
        hasAnyAgentData = true;
        switch (agent) {
          case "company-search":
            setCompanyReportData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
          case "interview":
            setInterviewPrepData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
          case "cover-letter":
            setCoverLetterData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
          case "deep-search":
            setDeepSearchData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
          case "resume":
            setResumeBuilderData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
          case "analytics":
            setAnalyticsData((prev) => ({ ...prev, [selectedJobId]: data }));
          case "career-intelligence":
            setCareerIntelligenceData((prev) => ({ ...prev, [selectedJobId]: data }));
            break;
        }
        
        setAgentStates((prev) => ({
          ...prev,
          [selectedJobId]: {
            ...(prev[selectedJobId] || {}),
            [agent]: {
              ...(prev[selectedJobId]?.[agent] || {
                jobId: selectedJobId,
                running: false,
                agentName: agent,
                progress: 100,
                status: "completed",
                messages: [],
              }),
              status: "completed",
              progress: 100,
              running: false,
              messages: [
                ...(prev[selectedJobId]?.[agent]?.messages || []),
                { text: "Loaded cached result.", type: "result" },
              ],
            },
          },
        }));
      }
      if (hasAnyAgentData) {
        setCompletedJobs(prev => ({ ...prev, [selectedJobId]: true }));
      }
    });
  }, [user, selectedJobId]);

  const processJobData = (jobs: any[]) => {
    return jobs.map((job) => {
      const applyUrl =
        job.application_instructions ||
        job.apply_now_url ||
        job.apply_url ||
        job.applyUrl ||
        job.application_url ||
        job.url ||
        "";
  
      // Process salary
      const salary = job.salary || job.salary_range || job.compensation;
      const formattedSalary = salary ? formatSalary(salary) : 'N/A';
  
      // Process date
      const datePosted = job.date_posted || job.posted_at || job.created_at || null;
  
      return {
        ...job,
        apply_now_url: applyUrl,
        application_instructions: applyUrl,
        salary: formattedSalary,
        date_posted: datePosted,
      };
    });
  };

  const getAgentMessage = (
    agentName: string,
    step: number,
    totalSteps: number,
    job: JobPosting
  ): AgentMessage => {
    const messages = {
      "deep-search": [
        "Initializing search parameters based on job requirements",
        "Scanning industry databases for related information",
        "Analyzing company background and market position",
        "Identifying key technologies mentioned in job description",
        "Cross-referencing skill requirements with industry standards",
        "Finding relevant articles and publications about the company",
        "Locating similar job positions for comparison",
        "Gathering salary data for comparable positions",
        "Compiling benefits information from multiple sources",
        "Found 15 matching job postings",
      ],
      "company-search": [
        "Initializing company profile search",
        "Gathering basic company information and founding history",
        "Analyzing company culture and work environment",
        "Researching company leadership and organizational structure",
        "Identifying company competitors and market position",
        "Examining company growth trajectory and financial health",
        "Collecting employee reviews and satisfaction metrics",
        "Analyzing recent news and press releases",
        "Identifying company values and mission statement",
        `Company report for ${job.company} successfully generated`,
      ],
      interview: [
        `Analyzing ${job.job_title} requirements for interview preparation`,
        "Identifying key technical questions based on job description",
        "Generating behavioral question scenarios relevant to the role",
        "Creating customized practice questions for technical skills",
        "Preparing company-specific question predictions",
        "Drafting strong answers to common questions for this role",
        `Developing interview strategies based on ${job.company} culture`,
        "Creating role-specific scenarios for situational questions",
        "Preparing questions to ask the interviewer",
        "Generated 10 tailored interview questions",
      ],
      resume: [
        "Analyzing job description for key requirements",
        "Identifying skill matches between resume and job posting",
        "Tailoring resume summary for position relevance",
        "Restructuring experience section to highlight relevant skills",
        "Optimizing keywords for ATS compatibility",
        "Enhancing accomplishments with metrics relevant to this role",
        "Refining technical skills section for perfect alignment",
        "Adjusting education and certification visibility",
        "Improving overall resume formatting and layout",
        `Optimized resume for ${job.job_title} position`,
      ],
      "cover-letter": [
        "Analyzing job requirements for personalized approach",
        "Crafting attention-grabbing introduction paragraph",
        "Developing narrative connecting your experience to job needs",
        "Highlighting specific achievements relevant to this position",
        `Incorporating ${job.company} research into the letter`,
        "Adding industry-specific terminology and keywords",
        "Creating compelling arguments for culture fit",
        "Developing strong closing paragraph with call to action",
        `Optimizing tone and voice for ${job.company} culture`,
        "Generated a tailored cover letter",
      ],
      analytics: [
        "Gathering application data relevant to this job category",
        "Analyzing historical application success patterns",
        "Comparing this opportunity against previous applications",
        "Calculating statistical match predictions",
        "Generating application strategy recommendations",
        "Creating visualization of success probability",
        "Analyzing interview conversion rates for similar roles",
        "Identifying optimal application timing",
        "Comparing salary data against market averages",
        "Analytics data successfully retrieved and processed",
      ],
      "career-intelligence": [
        "Analyzing job market trends for this position",
        "Identifying skill demand fluctuations over time",
        "Comparing salary trends against industry benchmarks",
        "Evaluating career growth opportunities in this field",
        "Analyzing job security metrics for this role",
        "Identifying emerging skills relevant to this position",
        "Evaluating long-term career prospects in this industry",
        "Analyzing geographical job distribution patterns",
        "Identifying potential career pivots based on market trends",
        `Career intelligence data successfully retrieved`,
      ],
    };

    const text =
      messages[agentName as keyof typeof messages]?.[step - 1] ||
      `Processing step ${step} of ${totalSteps}`;
    const type = getMessageType(step, totalSteps);
    return { text, type };
  };

  const getMessageType = (
    step: number,
    totalSteps: number
  ): "reasoning" | "action" | "result" => {
    if (step === totalSteps) return "result";
    if (step < 3) return "reasoning";
    return "action";
  };

  const runAgents = useCallback(
    async (jobId: string) => {
      setAnalyticsData(null);

      const job = jobListings.find((j) => j.id === (jobId as unknown as number));
      if (!job) {
        setSelectedJob(null);
        setSelectedJobId(null);
        setShowMinimizedAgentIndicator(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find job details.",
        });
        return;
      }

      const isAnyAgentRunning = runningAgentsByJob[jobId]?.length > 0;
      if (isAnyAgentRunning) {
        setShowMinimizedAgentIndicator(true);
      } else {
        setSelectedJob(job);
        setSelectedJobId(jobId);
        setIsJobDetailsOpen(true);
      }

      const agentNames: string[] = [
        "deep-search",
        "company-search",
        "interview",
        "resume",
        "cover-letter",
        "analytics",
        "career-intelligence",
      ];

      const jobAgentStates: Record<string, AgentState> = {};
      agentNames.forEach((name) => {
        jobAgentStates[name] = {
          ...initialAgentStates[name],
          jobId,
          running: true,
          status: "running",
          progress: 0,
          messages: [{ text: "Starting agent...", type: "reasoning" }],
        };
      });
      setAgentStates((prev) => ({
        ...prev,
        [jobId]: jobAgentStates,
      }));

      setRunningAgentsByJob((prev) => ({
        ...prev,
        [jobId]: agentNames,
      }));
      agentNames.forEach((agentName) => {
        if (props.onAgentRunning) {
          props.onAgentRunning(agentName);
        }
      });

      toast({
        title: "Agents activated",
        description: "Our AI agents are now analyzing this job opportunity",
      });

      // Simulation for progress and messages
      const totalSimulatedSteps = 10;
      const simulationIntervals: Record<string, NodeJS.Timeout> = {};

      agentNames.forEach((agentName) => {
        let currentStep = 0;
        simulationIntervals[agentName] = setInterval(() => {
          setAgentStates((prev) => {
            const currentJobAgentState = prev[jobId] || {};
            const currentAgentState =
              currentJobAgentState[agentName] || initialAgentStates[agentName];

            if (
              currentAgentState.status === "running" &&
              currentAgentState.progress < 100
            ) {
              currentStep++;
              const newProgress = Math.min(
                Math.floor((currentStep / totalSimulatedSteps) * 95),
                95
              );
              const newMessage = getAgentMessage(
                agentName,
                currentStep,
                totalSimulatedSteps,
                job
              );

              const lastMessage =
                currentAgentState.messages[currentAgentState.messages.length - 1]
                  ?.text;
              const messages =
                lastMessage === newMessage.text
                  ? currentAgentState.messages
                  : [...currentAgentState.messages, newMessage];

              return {
                ...prev,
                [jobId]: {
                  ...currentJobAgentState,
                  [agentName]: {
                    ...currentAgentState,
                    progress: newProgress,
                    messages: messages,
                  },
                },
              };
            }
            return prev;
          });
        }, 1500);
      });

      // Define safePromise inside runAgents
      const safePromise = async (
        promiseCreator: () => Promise<any>,
        agentName: string,
        errorMsg: string
      ) => {
        try {
          const result = await promiseCreator();
          clearInterval(simulationIntervals[agentName]);
          
          setAgentStates((prev) => ({
            ...prev,
            [jobId]: {
              ...prev[jobId],
              [agentName]: {
                ...prev[jobId][agentName],
                status: "completed",
                progress: 100,
                messages: [
                  ...(prev[jobId]?.[agentName]?.messages || []),
                  getAgentMessage(
                    agentName,
                    totalSimulatedSteps,
                    totalSimulatedSteps,
                    job
                  ),
                ],
              },
            },
          }));

          setRunningAgentsByJob((prev) => ({
            ...prev,
            [jobId]: prev[jobId]?.filter((name) => name !== agentName) || [],
          }));

          setCompletedAgentsByJob((prev) => ({
            ...prev,
            [jobId]: [...(prev[jobId] || []), agentName],
          }));

          if (props.onAgentComplete) {
            props.onAgentComplete(agentName);
          }

          return { status: "fulfilled", value: result };
        } catch (error: any) {
          console.error(`${agentName} fetch failed:`, error);
          clearInterval(simulationIntervals[agentName]);

          if (axios.isAxiosError(error) && error.response?.status === 429) {
            toast({
              variant: "destructive",
              title: `${agentName} temporarily unavailable`,
              description: "Rate limit exceeded. Please try again in a few minutes.",
            });
          } else if (error?.response?.status === 404) {
            toast({
              variant: "destructive",
              title: `${agentName} not found`,
              description: "The requested resource was not found.",
            });
          } else {
            toast({
              variant: "destructive",
              title: `${agentName} failed`,
              description: error?.message || errorMsg,
            });
          }

          setAgentStates((prev) => ({
            ...prev,
            [jobId]: {
              ...prev[jobId],
              [agentName]: {
                ...prev[jobId][agentName],
                status: "error",
                progress: 100,
                messages: [
                  ...(prev[jobId]?.[agentName]?.messages || []),
                  { text: `Error: ${error?.message || errorMsg}`, type: "error" },
                ],
              },
            },
          }));

          setRunningAgentsByJob((prev) => ({
            ...prev,
            [jobId]: prev[jobId]?.filter((name) => name !== agentName) || [],
          }));

          return { status: "rejected", reason: error };
        }
      };

      // Define agent promise creators
      const agentPromiseCreators = {
        
        analytics: () =>
          axios
            .post("https://job-trend-api328.azurewebsites.net/v1/analyze", {
              skill_or_job: job.job_title,
              geo: "US",
              ma_window: 20,
              volatility_window: 4,
              smoothing_window: 4,
              anomaly_threshold: 2,
            })
            .then(({ data }) => {
              setAnalyticsData((prev) => ({ ...prev, [jobId]: data }));
              console.log("data:", data);
              if (user) saveAgentResult("analytics", jobId, user.id, data);
              setAgentStates((prev) => ({
                ...prev,
                [jobId]: {
                  ...prev[jobId],
                  analytics: {
                    ...prev[jobId].analytics,
                    status: "completed",
                    progress: 100,
                    messages: [
                      ...prev[jobId].analytics.messages,
                      {
                        text: "Analytics data successfully retrieved and processed.",
                        type: "result",
                      },
                    ],
                  },
                },
              }));
              
            }),
           
        "company-search": () =>
          fetch(
            "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/company_research",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ job_posting_id: jobId }),
            }
          ).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to fetch company report");
            }
            const data = await response.json();
            setCompanyReportData((prev) => ({
              ...prev,
              [jobId]: data.final_report.report,
            }));
            if (user) saveAgentResult("company-search", jobId, user.id, data.final_report.report);
            return data;
          }),

        interview: () =>
          fetch(
            "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/interview_prep",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                job_posting_id: jobId,
                resume: currentResume?.data?.parsed_text || "",
              }),
            }
          ).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.message || "Failed to fetch interview preparation data"
              );
            }
            const data = await response.json();
            const combinedReport = `${data.hr_interview}\n\n---\n\n${data.technical_interview}`;
            setInterviewPrepData((prev) => ({ ...prev, [jobId]: combinedReport }));
            if (user) saveAgentResult("interview", jobId, user.id, combinedReport);
            return data;
          }),

        "cover-letter": () =>
          fetch(
            "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/cover_letter",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                job_posting_id: jobId,
                resume: currentResume?.data?.parsed_text || "",
              }),
            }
          ).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to fetch cover letter data");
            }
            const data = await response.json();
            setCoverLetterData((prev) => ({ ...prev, [jobId]: data.cover_letter }));
            if (user) saveAgentResult("cover-letter", jobId, user.id, data.cover_letter);
            return data;
          }),

        "deep-search": () =>
          fetch(
            "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/deep_research",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                job_posting_id: jobId,
                resume: currentResume?.data?.parsed_text || "",
              }),
            }
          ).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to fetch deep search data");
            }
            const data = await response.json();
            setDeepSearchData((prev) => ({ ...prev, [jobId]: data.final_report }));
            if (user) saveAgentResult("deep-search", jobId, user.id, data.final_report);
            return data.final_report;
          }),

        resume: async () => {
          try {
            const deepSearchReport = deepSearchData[jobId];
            setIsResumeLoading((prev) => ({ ...prev, [jobId]: true }));

            const response = await fetch(
              "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/resume_builder",
              {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  resume: currentResume?.data?.parsed_text || "",
                  job_analysis_report: deepSearchReport || "",
                }),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to fetch resume builder data");
            }

            const data = await response.json();
            setResumeBuilderData((prev) => ({
              ...prev,
              [jobId]: data.rewritten_resume,
            }));
            if (user) saveAgentResult("resume", jobId, user.id, data.rewritten_resume);
            return data;
          } catch (error) {
            console.error("Resume builder failed:", error);
            throw error;
          } finally {
            setIsResumeLoading((prev) => ({ ...prev, [jobId]: false }));
          }
        },

        "career-intelligence": () =>
          fetch(
            "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/career-intelligence",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ job_id: jobId, report_type: "advanced" }),
            }
          ).then(async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.message || "Failed to fetch career intelligence data"
              );
            }
            const data = await response.text();
            setCareerIntelligenceData((prev) => ({ ...prev, [jobId]: data }));
            if (user) saveAgentResult("career-intelligence", jobId, user.id, data);
            return data;
          }),
      };

      try {
        // Execute promises sequentially with a short delay
        for (const agentName of agentNames) {
          const promiseCreator =
            agentPromiseCreators[agentName as keyof typeof agentPromiseCreators];
          if (promiseCreator) {
            await safePromise(
              () => promiseCreator(),
              agentName,
              `We couldn't generate the ${agentName.replace("-", " ")} report for this job.`
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
        setCompletedJobs((prev) => ({ ...prev, [jobId]: true }));
      } finally {
        // Cleanup intervals
        agentNames.forEach((agentName) => {
          clearInterval(simulationIntervals[agentName]);
        });

        setTimeout(() => {
          agentNames.forEach((agentName) => {
            if (props.onAgentStopped) {
              props.onAgentStopped(agentName);
            }
          });
          setRunningAgentsByJob((prevRunning) => {
            const stillRunning = Object.values(prevRunning).some(
              (agents) => agents.length > 0
            );
            if (!stillRunning) {
              setShowMinimizedAgentIndicator(false);
            }
            return prevRunning;
          });
        }, 5000);
      }
    },
    [
      jobListings,
      runningAgentsByJob,
      currentResume,
      user,
      toast,
      props,
      getAgentMessage,
      initialAgentStates,
    ]
  );

  const openJobDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setSelectedJobId(job.id as unknown as string);
    setIsJobDetailsOpen(true);
  };

  const handleResumeUploaded = async (file: File, parsedData: string) => {
    const JOB_CACHE_KEY = `job_matches_${user?.id}_${file.name}`;
    localStorage.removeItem(JOB_CACHE_KEY);
    await addResume(file, parsedData);
  };

  useEffect(() => {
    if (uploadedResumes.length > 0) {
      setShowResumeUploadDialog(false);
    } else {
      setShowResumeUploadDialog(true);
    }
  }, [uploadedResumes]);

  const renderAgentTabContent = (
    agentName: string,
    data: any,
    ContentComponent: React.ComponentType<any>,
    contentSpecificProps: any = {}
  ) => {
    const agent = agentStates[selectedJobId || ""]?.[agentName];
    const tabTitle = getTabTitle(agentName);

    if (!selectedJobId) {
      return (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-workspace-text">
            {tabTitle}
          </h2>
          <WorkspaceCard className="border-2">
            <div className="py-16 text-center">
              <h3 className="text-lg font-medium text-workspace-muted mb-2">
                No data yet
              </h3>
              <p className="text-workspace-muted mb-6">
                Select a job and run agents to generate content for this tab
              </p>
            </div>
          </WorkspaceCard>
        </div>
      );
    }

    // if (
    //   agent?.status === "running" ||
    //   (!data && agent?.status !== "error" && agent?.status !== "completed")
    // ) {
    //   return (
    //     <div className="space-y-4">
    //       <h2 className="text-xl font-semibold text-workspace-text">
    //         {tabTitle}
    //       </h2>
    //       <AgentProgress
    //         agent={agent || initialAgentStates[agentName]}
    //         jobTitle={selectedJob?.job_title || "this job"}
    //       />
    //     </div>
    //   );
    // }

    if (agent?.status === "error" && !data) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-workspace-text">
            {tabTitle}
          </h2>
          <div className="text-workspace-muted">
            Failed to generate {tabTitle} report. Please try running the agents
            again.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-workspace-text">
          {tabTitle}
        </h2>
        <ContentComponent
          agentStates={Object.values(agentStates[selectedJobId] || {})}
          selectedJobId={selectedJobId}
          {...contentSpecificProps}
        />
      </div>
    );
  };

  function formatSalary(salary: string | number): string {
    if (!salary) {
      return "N/A";
    }

    if (typeof salary === 'number') {
      return salary.toLocaleString('en-US');
    }
  
    // Handle string formats like "120000-150000" or "120k-150k"
    const range = salary.toString().split('-');
    if (range.length === 2) {
      return `${formatSingleSalary(range[0])} - ${formatSingleSalary(range[1])}`;
    }
    return formatSingleSalary(salary);
  }
  
  function formatSingleSalary(salary: string): string {
    // Remove any non-numeric characters except k/K (for thousands)
    const cleaned = salary.replace(/[^0-9kK.]/g, '');
  
    // Handle k/K notation (e.g., 120k -> 120,000)
    if (cleaned.toLowerCase().includes('k')) {
      const num = parseFloat(cleaned.toLowerCase().replace('k', ''));
      return `${(num * 1000).toLocaleString('en-US')}`;
    }
  
    // Format regular numbers
    const num = parseFloat(cleaned);
    return isNaN(num) ? salary : num.toLocaleString('en-US');
  }
  
  function formatDate(dateString?: string): string {
    if (!dateString) return "N/A";
    
    // Try parsing as ISO string first
    let date = new Date(dateString);
    
    // If that fails, try parsing as milliseconds
    if (isNaN(date.getTime())) {
      date = new Date(parseInt(dateString));
    }
    
    // If still invalid, try removing timezone if present
    if (isNaN(date.getTime())) {
      const cleanDateString = dateString.split('T')[0]; // Take just the date part
      date = new Date(cleanDateString);
    }
    
    // Final fallback if still invalid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "N/A";
    }
    
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  const renderContent = () => {
    switch (props.activeTab) {
      case "job":
        return (
          <div className="space-y-4 font-landpage ">
            <h2 className="text-xl font-semibold text-workspace-text">
              Job Search
            </h2>
            <p className="text-workspace-muted mb-6">
              Search for job opportunities that match your profile.
            </p>
            <div className="space-y-4">
              {jobListings.length === 0 ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-4 border border-workspace-border rounded-lg bg-muted/50 animate-pulse"
                    >
                      <div className="h-6 bg-workspace-muted rounded w-3/4 mb-3"></div>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="h-4 w-1/4 bg-workspace-muted rounded"></div>
                        <div className="h-4 w-1/4 bg-workspace-muted rounded"></div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm mbilta-4">
                        <div className="h-4 w-1/6 bg-workspace-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-workspace-muted rounded"></div>
                        <div className="h-4 w-1/6 bg-workspace-muted rounded"></div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-20 bg-workspace-muted rounded"></div>
                        <div className="h-8 w-20 bg-workspace-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                jobListings.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-workspace-border rounded-lg hover:border-workspace-accent transition-all duration-200 cursor-pointer bg-transparent"
                    onClick={() => openJobDetails(job)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-workspace-text max-w-[80%] text-wrap truncate">
                          {job.job_title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building2 className="w-4 h-4 text-workspace-muted" />
                          <span className="text-workspace-text">
                            {job.company}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {job.match_score && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-2 py-0.5 rounded-md text-xs font-semibold",
                              job.match_score >= 0.9
                                ? "bg-[#DAFBE2] text-[#288448] border-[#A8DBBB]"
                                : "bg-[#D8DFFF] text-[#5569B1] border-[#A9B6DB]"
                            )}
                          >
                            {Math.round(job.match_score * 100)}% Match
                          </Badge>
                        )}
                        <Toggle
                          pressed={isJobSaved(job.id)}
                          onPressedChange={() => toggleSavedJob(job)}
                          aria-label="Toggle saved job"
                          className="data-[state=on]:text-purple-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Toggle>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-workspace-muted mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-workspace-muted" />
                        {formatSalary(job.salary!)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-workspace-muted" />
                        {formatDate(job.date_posted!)}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (completedJobs[job.id as unknown as string]) {
                            if (props.onTabChange) {
                              props.onTabChange("deep-search"); // Default to deep-search after completion
                            }
                            setSelectedJob(job);
                            props.onJobSelected(job.job_title);
                            setSelectedJobId(job.id as unknown as string);
                          } else if (
                            runningAgentsByJob[job.id as unknown as string]?.length > 0
                          ) {
                            setSelectedJob(job);
                            props.onJobSelected(job.job_title);
                            handleToggleMinimizedIndicator(
                              !minimizedIndicatorExpanded
                            );
                          } else if (props.onJobSelected) {
                            props.onJobSelected(job.job_title);
                            setSelectedJob(job);
                            runAgents(job.id as unknown as string);
                          }
                        }}
                      >
                        <Zap className="w-4 h-4 text-gray-400" />
                        {completedJobs[job.id as unknown as string]
                          ? "View Agents Results"
                          : runningAgentsByJob[job.id as unknown as string]?.length > 0
                            ? "Processing..."
                            : "Run Agents"}
                      </Button>
                      <Button
                        variant="turquoise"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Check application_instructions first, then fall back to apply_now_url
                          const applyUrl =
                            job.application_instructions || job.apply_now_url;
                          if (applyUrl) {
                            window.open(applyUrl, "_blank");
                          } else {
                            toast({
                              title: "No Apply Link",
                              description:
                                "No application link is available for this job.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "deep-search":
        return renderAgentTabContent(
          "deep-search",
          deepSearchData[selectedJobId || ""],
          DeepSearchTabContent,
          { deepSearchData: deepSearchData[selectedJobId || ""] }
        );
      case "interview":
        return renderAgentTabContent(
          "interview",
          interviewPrepData[selectedJobId || ""],
          InterviewPreparationTabContent,
          {
            interviewPrepData: interviewPrepData[selectedJobId || ""],
          }
        );
        case "resume": {
          const resumeAgent = agentStates[selectedJobId || ""]?.resume;
          const resumeIsLoading = isResumeLoading[selectedJobId || ""] || false;
          const resumeReportContent = resumeBuilderData[selectedJobId || ""];
        
          if (!selectedJobId) {
            return (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-workspace-text">
                  Resume Builder
                </h2>
                <WorkspaceCard className=" border-2">
                  <div className="py-16 text-center">
                    <h3 className="text-lg font-medium text-workspace-muted mb-2">
                      No data yet
                    </h3>
                    <p className="text-workspace-muted mb-6">
                      Select a job and run agents to generate content for this tab
                    </p>
                  </div>
                </WorkspaceCard>
              </div>
            );
        }
        
          // if (
          //   resumeIsLoading ||
          //   resumeAgent?.status === "running" ||
          //   (!resumeReportContent &&
          //     resumeAgent?.status !== "error" &&
          //     resumeAgent?.status !== "completed")
          // ) {
          //   return (
          //     <div className="space-y-4">
          //       <h2 className="text-xl font-semibold text-workspace-text">
          //         Resume Builder
          //       </h2>
          //       <AgentProgress
          //         agent={resumeAgent || initialAgentStates.resume}
          //         jobTitle={selectedJob?.job_title || "this job"}
          //       />
          //     </div>
          //   );
          // }
        
          if (resumeAgent?.status === "error" && !resumeReportContent) {
            return (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-workspace-text">
                  Resume Builder
                </h2>
                <div className="text-workspace-muted">
                  Failed to generate resume. Please try running the agents again.
                </div>
              </div>
            );
          }
        
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-text">
                Resume Builder
              </h2>
              <ResumeBuilderTabContent
                resumeBuilderData={resumeReportContent}
                agentStates={Object.values(agentStates[selectedJobId] || {})}
                selectedJobId={selectedJobId}
              />
            </div>
          );
        }
        

      case "cover-letter":
        return renderAgentTabContent(
          "cover-letter",
          coverLetterData[selectedJobId || ""],
          CoverLetterTabContent,
          { coverLetterData: coverLetterData[selectedJobId || ""] }
        );
      case "career-intelligence":
        return renderAgentTabContent(
          "career-intelligence",
          careerIntelligenceData[selectedJobId || ""],
          CareerIntelligenceTabContent,
          {
            careerIntelligenceData:
              careerIntelligenceData[selectedJobId || ""],
          }
        );
      case "company-search":
        return renderAgentTabContent(
          "company-search",
          companyReportData[selectedJobId || ""],
          CompanySearchTabContent,
          { companyReportData: companyReportData[selectedJobId || ""] }
        );
      case "analytics":
        const currentAnalyticsData = analyticsData
          ? analyticsData[selectedJobId || ""]
          : null;
        return renderAgentTabContent(
          "analytics",
          currentAnalyticsData,
          AnalyticsTabContent,
          { analyticsData: currentAnalyticsData, selectedJob: selectedJob }
        );
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-workspace-text">
              {props.activeTab}
            </h2>
            <p className="text-workspace-muted">This feature is coming soon.</p>
          </div>
        );
    }
  };

  const getTabTitle = (tabId: string): string => {
    switch (tabId) {
      case "deep-search":
        return "Deep Search";
      case "company-search":
        return "Company Search";
      case "interview":
        return "Interview Preparation";
      case "resume":
        return "Resume Builder";
      case "cover-letter":
        return "Cover Letter";
      case "analytics":
        return "Analytics";
      case "career-intelligence":
        return "Career Intelligence"; // Fixed typo here
      default:
        return tabId.charAt(0).toUpperCase() + tabId.slice(1);
    }
  };

  return (
    <div
      className={`p-8 pb-0 flex flex-col h-full ${
        // showResumeUploadDialog ? "blur-sm" : 
        ""
      }`}
    >
      <ScrollArea className="flex-1 h-0 min-h-0">{renderContent()}</ScrollArea>
      {/* <ResumeUploadDialog
        isOpen={showResumeUploadDialog}
        onOpenChange={setShowResumeUploadDialog}
        onResumeUploaded={handleResumeUploaded}
      /> */}
      {selectedJobId && (
        <div style={{
          position: 'fixed',
          bottom: '20px', // space from bottom of viewport
          right: '20px',  // adjust as needed
          zIndex: 1000,   // ensure it's above other elements
        }}>
          <MinimizedAgentIndicator
            jobTitle={selectedJob?.job_title || "Unknown Job"}
            currentJobAgentStates={agentStates[selectedJob.id] || {}}
            onClose={() => setShowMinimizedAgentIndicator(false)}
            isExpanded={minimizedIndicatorExpanded}
            onToggleExpand={handleToggleMinimizedIndicator}
          />
        </div>
        
      )}
      {isJobDetailsOpen && selectedJob && (
        <JobDetailsDialog
          job={selectedJob}
          isOpen={isJobDetailsOpen}
          onOpenChange={setIsJobDetailsOpen}
          onOpenProcess= {handleToggleMinimizedIndicator}
          onRunAgents={runAgents}
          onViewResults= {props.onTabChange}
          isAgentRunning={
            runningAgentsByJob[selectedJobId as string]?.length > 0
          }
          isCompleted={completedJobs[selectedJobId as string] || false}
        />
      )}
    </div>
  );
};