import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Toggle
} from './_ui';
import {
  Bookmark,
  Building2,
  Check,
  Clock,
  ExternalLink,
  MapPin,
  Zap,
  DollarSign,
  CalendarDays
} from 'lucide-react';
import { useSavedJobs } from '@/hooks/use-saved-jobs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface JobPostingWithAllDetails {
  id: number | string;
  job_title: string;
  company: string;
  location: string;
  salary?: string;
  level: string;
  posted?: string;
  match_score: number;
  description: string;
  application_instructions?: string;
  apply_now_url?: string;
  requirements?: string[];
  date_posted?: string;
}

interface JobDetailsDialogProps {
  job: JobPostingWithAllDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProcess: (open: boolean) => void;
  onRunAgents: (jobId: number | string) => void;
  onViewResults: (tabId: string) => void;
  isAgentRunning: boolean;
  isCompleted: boolean;
}

const completedAgentJobs = new Map<number | string, boolean>();

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  job,
  isOpen,
  onOpenChange,
  onOpenProcess,
  onViewResults,
  onRunAgents,
  isAgentRunning,
  isCompleted,
}) => {
  const { isJobSaved, toggleSavedJob } = useSavedJobs();
  const { toast } = useToast();
  const [agentProgress, setAgentProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [agentsCompleted, setAgentsCompleted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const stageNames = [
    'Analyzing requirements',
    'Gathering data',
    'Processing information',
    'Generating insights',
    'Finalizing report',
  ];

  useEffect(() => {
    if (job) {
      setAgentsCompleted(completedAgentJobs.get(job.id) || false);
      setAgentsCompleted(isCompleted);
    }
  }, [job, isCompleted]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isAgentRunning && job) {
      setAgentProgress(0);
      setCurrentAction('Initializing agents...');
      setCurrentStage(0);
      setAgentsCompleted(false);
      setIsPopoverOpen(true);

      const maxProgress = 100;
      const duration = 10000;
      const intervalTime = 200;
      const increment = maxProgress / (duration / intervalTime);

      intervalId = setInterval(() => {
        setAgentProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + increment, 100);

          if (newProgress <= 20) {
            setCurrentAction('Analyzing job requirements...');
            setCurrentStage(1);
          } else if (newProgress > 20 && newProgress <= 40) {
            setCurrentAction('Searching for company information...');
            setCurrentStage(2);
          } else if (newProgress > 40 && newProgress <= 60) {
            setCurrentAction('Preparing resume recommendations...');
            setCurrentStage(3);
          } else if (newProgress > 60 && newProgress <= 80) {
            setCurrentAction('Generating interview questions...');
            setCurrentStage(4);
          } else {
            setCurrentAction('Finalizing analysis...');
            setCurrentStage(5);
          }

          if (newProgress >= 100) {
            if (job) {
              completedAgentJobs.set(job.id, true);
              setAgentsCompleted(true);
            }
            if (intervalId) clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, intervalTime);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    } else if (!isAgentRunning && isPopoverOpen) {
      setIsPopoverOpen(false);
    }
  }, [isAgentRunning, job, isPopoverOpen]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setIsPopoverOpen(false);
    }
  };

  const handleShowAnalytics = () => {
    onOpenChange(false);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-900 dark:bg-[#0A0F29] border-gray-200 dark:border-[#1D2B4A]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {job.job_title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-200">{job.company}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className={cn(
                  'px-2 py-0.5',
                  job.match_score && job.match_score >= 0.9
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800'
                    : job.match_score && job.match_score >= 0.8
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800'
                )}
              >
                {Math.round(job.match_score * 100)}% Match
              </Badge>
              <Toggle
                pressed={isJobSaved(job.id)}
                onPressedChange={() => toggleSavedJob(job)}
                aria-label={isJobSaved(job.id) ? 'Remove from saved jobs' : 'Save job'}
                className="data-[state=on]:text-rose-500 dark:data-[state=on]:text-rose-400"
              >
                <Bookmark className="w-4 h-4" />
              </Toggle>
            </div>
          </div>
          
          {agentsCompleted && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-700 dark:text-green-300">
                Agents have completed their analysis
              </AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-400">
                Check the Agents tab in the workspace to see detailed insights
                and recommendations.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.level}
            </div>
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </div>
            )}
            {job.posted && (
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {job.posted}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-[#101831] p-4 rounded-lg border border-gray-200 dark:border-[#1D2B4A]">
            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-200">
              Full Job Description
            </h3>
            {job.description ? (
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {job.description}
              </p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">
                No job description available for this posting.
              </p>
            )}
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#101831] p-4 rounded-lg border border-gray-200 dark:border-[#1D2B4A]">
              <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-200">
                Key Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(isAgentRunning || agentsCompleted) && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-[#101831] border border-gray-200 dark:border-[#1D2B4A] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <Zap className="w-4 h-4 text-blue-500 dark:text-[#5ce1e6]" />
                  Agent Progress
                </h3>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
                  {agentsCompleted ? '100%' : `${Math.round(agentProgress)}%`}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                <div
                  className="bg-blue-500 dark:bg-[#5ce1e6] h-1.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${agentsCompleted ? 100 : agentProgress}%` }}
                />
              </div>

              <div className="relative mt-6 ml-6">
                <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-gray-300 dark:bg-gray-600" />
                {stageNames.map((stage, index) => (
                  <div key={index} className="mb-6 relative flex items-start">
                    <div
                      className={cn(
                        'absolute -left-[9px] top-[6px] w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300',
                        agentsCompleted || currentStage > index + 1
                          ? 'border-blue-500 dark:border-[#5ce1e6] bg-blue-500 dark:bg-[#5ce1e6]'
                          : currentStage === index + 1
                          ? 'border-blue-500 dark:border-[#5ce1e6] bg-blue-500 dark:bg-[#5ce1e6]'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101831]'
                      )}
                    >
                      {(agentsCompleted || currentStage > index + 1) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <div
                        className={cn(
                          'text-sm transition-all duration-300',
                          agentsCompleted || currentStage > index + 1
                            ? 'text-blue-500 dark:text-[#5ce1e6] font-medium'
                            : currentStage === index + 1
                            ? 'text-blue-500 dark:text-[#5ce1e6] font-medium'
                            : 'text-gray-400 dark:text-gray-400'
                        )}
                      >
                        {stage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p
                className={cn(
                  'text-xs text-gray-500 dark:text-gray-400 mt-3',
                  isAgentRunning && !agentsCompleted ? 'animate-pulse' : ''
                )}
              >
                {agentsCompleted ? 'Analysis complete!' : currentAction}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="default"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const applyUrl = job.application_instructions || job.apply_now_url;
                if (applyUrl) {
                  window.open(applyUrl, '_blank');
                } else {
                  toast({
                    title: 'No Apply Link',
                    description: 'No application link is available for this job.',
                    variant: 'destructive',
                  });
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Apply
            </Button>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    if (!agentsCompleted && !isAgentRunning) {
                      onRunAgents(job.id);
                      setIsPopoverOpen(true);
                    } else if (isAgentRunning) {
                      handleShowAnalytics();
                      setIsPopoverOpen(false);
                      onOpenProcess(true);
                    } else {
                      handleShowAnalytics();
                      setIsPopoverOpen(false);
                      onViewResults('deep-search');
                    }
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isAgentRunning
                    ? 'Processing...'
                    : agentsCompleted
                    ? 'View Agents Results'
                    : 'Run Agents'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 bg-white dark:bg-[#101831] border-gray-200 dark:border-[#1D2B4A]"
                align="end"
                sideOffset={10}
              >
                <div className="p-3 border-b border-gray-200 dark:border-[#1D2B4A]">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    What happens when you run agents?
                  </h4>
                </div>
                <div className="p-3 text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2">
                    Our AI agents will analyze this job posting to provide you
                    with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Deep insights about the role and company</li>
                    <li>Tailored resume and cover letter recommendations</li>
                    <li>Interview preparation materials</li>
                    <li>Skill gap analysis and market trends</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};