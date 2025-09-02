"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { AgentState } from "./AgentProgress";
import { MarkdownReport } from "./markdown-report";
import { WorkspaceCard } from "./WorkspaceCard";
import { cn } from "@/lib/utils";
import React from "react";

interface CompanySearchTabContentProps {
  agentStates: AgentState[];
  companyReportData: Record<string, string>;
  selectedJobId: string | null;
}

export const CompanySearchTabContent = ({
  agentStates,
  companyReportData,
  selectedJobId,
}: CompanySearchTabContentProps) => {
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
    );
  }

  if (agentToDisplay.status === "running") {
    return (
      <div className="text-workspace-muted animate-pulse">
        Generating company report...
      </div>
    );
  }

  if (agentToDisplay.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to generate company report. Please try running the agents
          again.
        </AlertDescription>
      </Alert>
    );
  }

  const report = companyReportData;
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-workspace-muted">
        <FileText className="w-10 h-10 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          No Deep Search Data Available
        </p>
        <p className="text-sm">
          Run agents on a job to generate a deep search report.
        </p>
      </div>
    );
  }

  if (!companyReportData) {
    return (
      <div className="text-workspace-muted">
        No company report available.
        <br />
        Run agents on a job to generate a company report.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "p-6 rounded-lg bg-gray-800/50 border border-gray-700",
          "overflow-auto max-h-[calc(100vh-200px)]"
        )}
      >
        <MarkdownReport content={report} />
      </div>
    </div>
  );
};
