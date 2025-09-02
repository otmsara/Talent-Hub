import React, { useEffect } from 'react';
import { Progress } from "./_ui/progress";
import { cn } from "@/lib/utils";
import { Search, Book, PenTool, Check } from "lucide-react";
import { WorkspaceCard } from './WorkspaceCard'; // Assuming this path is correct

// Types
export interface AgentState {
  jobId: string;
  running: boolean;
  agentName: string;
  progress: number;
  status: "idle" | "running" | "completed" | "error";
  messages: { text: string; type: "reasoning" | "action" | "result" }[];
}

interface AgentProgressProps {
  agent: AgentState;
  onComplete?: (agentName: string) => void;
}

export const AgentProgress = ({ agent, onComplete }: AgentProgressProps) => {
  useEffect(() => {
    if (agent.status === "completed" && onComplete) {
      onComplete(agent.agentName);
    }
  }, [agent.status, agent.agentName, onComplete]);

  const getAgentSteps = (agentName: string) => {
    const stepsMap = {
      "deep-search": {
        searching: "Searching for comprehensive information across multiple sources",
        reading: ["wikipedia", "reddit", "philosophytalk", "aithor"],
        writing: "Compiling detailed analysis from diverse sources"
      },
      "company-search": {
        searching: "Analyzing company background, culture, and market position",
        reading: ["wikipedia", "linkedin", "glassdoor", "crunchbase"],
        writing: "Creating company profile and insights"
      },
      "interview": {
        searching: "Analyzing job description and common interview patterns",
        reading: ["interview-guides", "company-blogs", "role-specific-forums"],
        writing: "Generating tailored interview questions and preparation tips"
      },
      "resume": {
        searching: "Analyzing job requirements and your current resume",
        reading: ["job-description", "your-resume", "industry-best-practices"],
        writing: "Optimizing resume content for the specific role"
      },
      "cover-letter": {
        searching: "Understanding job and company specifics for a compelling narrative",
        reading: ["job-description", "company-website", "your-experience"],
        writing: "Drafting a personalized and impactful cover letter"
      },
      "analytics": {
        searching: "Gathering and processing relevant application data",
        reading: ["historical-data", "market-benchmarks", "success-metrics"],
        writing: "Generating strategic insights and recommendations"
      },
      "career-intelligence": {
        searching: "Scanning career trends and industry outlooks",
        reading: ["market-reports", "economic-forecasts", "expert-articles"],
        writing: "Compiling a career intelligence report with growth opportunities"
      },
      "skill-gap": {
        searching: "Evaluating required skills versus your profile",
        reading: ["jobdescription", "linkedin", "stackoverflow", "github"],
        writing: "Generating skill gap analysis and recommendations"
      }
    };

    return stepsMap[agentName] || {
      searching: "Gathering relevant information",
      reading: ["sources"],
      writing: "Preparing analysis"
    };
  };

  const renderReasoningSteps = () => {
    const steps = getAgentSteps(agent.agentName);
    const searchThreshold = 1;
    const readThreshold = 30;
    const writeThreshold = 70;

    const isSearchingActive = agent.progress >= searchThreshold;
    const isReadingActive = agent.progress >= readThreshold;
    const isWritingActive = agent.progress >= writeThreshold;

    return (
      <div className="mt-4 space-y-6">
        {/* Searching Step */}
        <div className="group relative">
          <div className="flex items-center gap-2 mb-2">
            <Search className={cn(
              "w-4 h-4",
              isSearchingActive || agent.status === "completed" ? "text-[#5ce1e6]" : "text-gray-600 dark:text-gray-400"
            )} />
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Searching</span>
          </div>
          <div className="pl-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="font-mono bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs flex-1">
                {steps.searching}
              </div>
              {(isReadingActive || agent.status === "completed") && (
                <Check className="w-4 h-4 text-[#5ce1e6]" />
              )}
            </div>
          </div>
        </div>

        {/* Reading Step */}
        <div className="group relative">
          <div className="flex items-center gap-2 mb-2">
            <Book className={cn(
              "w-4 h-4",
              isReadingActive || agent.status === "completed" ? "text-[#5ce1e6]" : "text-gray-600 dark:text-gray-400"
            )} />
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Reading</span>
          </div>
          <div className="pl-6 flex flex-wrap gap-2">
            {steps.reading.map((source, index) => (
              <span
                key={index}
                className={cn(
                  "text-xs px-2 py-1 rounded",
                  (isReadingActive || agent.status === "completed")
                    ? "bg-[#5ce1e6]/20 text-[#5ce1e6] dark:bg-[#5ce1e6]/30 dark:text-[#5ce1e6]"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {source}
                {(isWritingActive || agent.status === "completed") && (
                  <Check className="w-3 h-3 inline-block ml-1 text-[#5ce1e6]" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Writing Step */}
        <div className="group relative">
          <div className="flex items-center gap-2 mb-2">
            <PenTool className={cn(
              "w-4 h-4",
              isWritingActive || agent.status === "completed" ? "text-[#5ce1e6]" : "text-gray-600 dark:text-gray-400"
            )} />
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Writing answer</span>
          </div>
          {(isWritingActive || agent.status === "completed") && (
            <div className="pl-6 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
              <span>{steps.writing}</span>
              {agent.status === "completed" && (
                <Check className="w-4 h-4 text-[#5ce1e6]" />
              )}
            </div>
          )}
        </div>

        {/* Completion Indicator */}
        {agent.status === "completed" && (
          <div className="mt-4 flex items-center justify-center text-[#5ce1e6] font-medium">
            <Check className="w-5 h-5 mr-2" />
            Analysis Complete
          </div>
        )}
      </div>
    );
  };

  if (agent.status === "idle") {
    return (
      <WorkspaceCard className="border-dashed border-2">
        <div className="py-16 text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            No data yet
          </h3>
          <p className="text-gray-400 mb-6">
            Select a job and run agents to generate content for this tab
          </p>
        </div>
      </WorkspaceCard>
    );
  }

  return (
    <div className={cn(
      "bg-white/50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700",
      "transition-all duration-300",
      "animate-[scale-in_0.2s_ease-in-out]"
    )}>
      <Progress
        value={agent.status === "completed" ? 100 : agent.progress}
        className="h-1.5 mb-4 bg-gray-200 [&>div]:bg-[#5ce1e6]"
      />
      {renderReasoningSteps()}
    </div>
  );
};