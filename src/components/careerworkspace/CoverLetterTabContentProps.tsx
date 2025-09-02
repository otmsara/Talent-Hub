import React from 'react';
import { FileText } from "lucide-react";
import { MarkdownReport } from "./markdown-report";
import { WorkspaceCard } from "./WorkspaceCard";
import { cn } from "@/lib/utils";

interface CoverLetterTabContentProps {
  coverLetterData: string;
}

export const CoverLetterTabContent = ({ coverLetterData }: CoverLetterTabContentProps) => {
  if (!coverLetterData) {
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
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cover Letter</h3>
      </div>
      <div className={cn(
        "p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700",
        "overflow-auto max-h-[calc(100vh-100px)]"
      )}>
        <MarkdownReport content={coverLetterData} />
      </div>
    </div>
  );
};