"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { AgentState } from "./AgentProgress";
import { MarkdownReport } from "./markdown-report";
import { WorkspaceCard } from "./WorkspaceCard";
import { cn } from "@/lib/utils";
import React from "react";

interface CareerIntelligenceTabContentProps {
  agentStates: AgentState[];
  careerIntelligenceData: string;
  selectedJobId: string | null;
}
 
export const CareerIntelligenceTabContent = ({
  agentStates,
  careerIntelligenceData,
  selectedJobId,
}: CareerIntelligenceTabContentProps) => {
  const completedAgent = agentStates
    .filter((agent) => agent.status === "completed")
    .sort(() => {
      return 0;
    })[0];

  const selectedAgent = selectedJobId
    ? agentStates.find((agent) => agent.jobId === selectedJobId)
    : null;
  const agentToDisplay = selectedAgent || completedAgent;
  
  if (!agentToDisplay) {
    return (
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
    );
  }
  
  if (agentToDisplay.status === "running") {
    return (
      <WorkspaceCard className=" border-2">
      <div className="py-16 text-center text-workspace-muted animate-pulse">
        Generating Career Intelligence report... (est. 2 min)
      </div>
      </WorkspaceCard>
    );
  }

  if (agentToDisplay.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to generate Career Intelligence report. Please try running the agents
          again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!careerIntelligenceData) {
    return (
      <div className="text-workspace-muted">
        No Career Intelligence report available.
        <br />
        Run agents on a job to generate a Career Intelligence report.
      </div>
    );
  }
  console.log("CareerIntelligenceData", careerIntelligenceData);


  return (
    <div className="space-y-4">
      <div
        className={cn(
          "p-6 rounded-lg bg-gray-800/50 border border-gray-700",
          "overflow-auto max-h-[calc(100vh-200px)]"
        )}
      >
        <MarkdownReport content={careerIntelligenceData} />
      </div>
    </div>
  );
};
