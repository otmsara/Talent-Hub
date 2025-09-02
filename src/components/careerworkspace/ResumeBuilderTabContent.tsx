import React from "react";
import { MarkdownReport } from "./markdown-report";
import { cn } from "@/lib/utils"; // Changed from @/ alias to relative path

interface ResumeBuilderTabContentProps {
  resumeBuilderData: string | undefined;
}

const ResumeBuilderTabContent: React.FC<ResumeBuilderTabContentProps> = ({
  resumeBuilderData,
}) => {
  if (!resumeBuilderData || resumeBuilderData.trim() === "") {
    return <div>Analyzing job requirements and your current resume</div>;
  }

  return (
    <div
      className={cn(
        "p-6 rounded-lg bg-gray-800/50 border border-gray-700 text-center",
        "overflow-auto max-h-[calc(100vh-100px)]"
      )}
    >
      <MarkdownReport content={resumeBuilderData} />
    </div>
  );
};

export default ResumeBuilderTabContent;