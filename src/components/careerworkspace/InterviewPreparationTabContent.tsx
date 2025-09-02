import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "./_ui/alert";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { AgentState } from "./AgentProgress";
import { MarkdownReport } from "./markdown-report";
import { WorkspaceCard } from "./WorkspaceCard";

interface InterviewPreparationTabContentProps {
  agentStates: AgentState[];
  interviewPrepData: Record<string, string>;
  selectedJobId: string | null;
}

export const InterviewPreparationTabContent: React.FC<InterviewPreparationTabContentProps> = ({
  agentStates,
  interviewPrepData,
  selectedJobId,
}) => {
  const completedAgent = agentStates
    .filter((agent) => agent.status === "completed")
    .sort(() => 0)[0];

  const selectedAgent = selectedJobId
    ? agentStates.find((agent) => agent.jobId === selectedJobId)
    : null;

  const agentToDisplay = selectedAgent || completedAgent;

  if (!agentToDisplay) {
    return (
      <WorkspaceCard className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="py-16 text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            No data yet
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            Select a job and run agents to generate content for this tab
          </p>
        </div>
      </WorkspaceCard>
    );
  }

  if (agentToDisplay.status === "running") {
    return (
      <div className="text-gray-500 dark:text-gray-400 animate-pulse">
        Generating interview preparation data...
      </div>
    );
  }

  if (agentToDisplay.status === "error") {
    return (
      <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to generate interview preparation data. Please try running the agents again.
        </AlertDescription>
      </Alert>
    );
  }

  const report = interviewPrepData[selectedJobId || ''];

  if (!report) {
    return (
      <WorkspaceCard className="border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="py-16 text-center">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            No data yet
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            Select a job and run agents to generate content for this tab
          </p>
        </div>
      </WorkspaceCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn(
        "p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700",
        "overflow-auto max-h-[calc(100vh-100px)]"
      )}>
        <MarkdownReport content={report} />
      </div>
    </div>
  );
};