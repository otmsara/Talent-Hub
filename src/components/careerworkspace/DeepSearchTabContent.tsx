import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Loader2 } from "lucide-react";
import { MarkdownReport } from "./markdown-report";
import { Button } from "./_ui/button";
import { cn } from "@/lib/utils";
import { WorkspaceCard } from "./WorkspaceCard";

interface DeepSearchTabContentProps {
  deepSearchData: string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const DeepSearchTabContent = ({
  deepSearchData,
  isLoading = false,
  onRefresh,
}: DeepSearchTabContentProps) => {
  const [parsedData, setParsedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deepSearchData) {
      try {
        if (typeof deepSearchData === "string" && deepSearchData.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(deepSearchData);
            setParsedData(parsed.final_report || parsed.report || deepSearchData);
          } catch {
            setParsedData(deepSearchData);
          }
        } else {
          setParsedData(deepSearchData);
        }
        setError(null);
      } catch (err) {
        console.error("Error parsing deep search data:", err);
        setError("Failed to parse report data. Please try again.");
        setParsedData(null);
      }
    } else {
      setParsedData(null);
    }
  }, [deepSearchData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500 dark:text-[rgb(76,201,240)]" />
        <p className="text-lg font-medium">
          Analyzing resume and job market data...
        </p>
        <p className="text-sm mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-10 h-10 mb-4 text-amber-500" />
        <p className="text-lg font-medium mb-2">Error Loading Report</p>
        <p className="text-sm mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Deep Search Report
          </h3>
        </div>

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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Deep Search Report
          </h3>
        </div>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh Analysis
          </Button>
        )}
      </div>

      <div className={cn(
        "p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700",
        "overflow-auto max-h-[calc(100vh-100px)] whitespace-pre-wrap"
      )}>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] inline-block">
            <MarkdownReport content={parsedData} />
          </div>
        </div>
      </div>
    </div>
  );
};