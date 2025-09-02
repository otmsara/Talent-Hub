import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  PenTool,
  Search,
  ClipboardList,
  FileSignature,
  PenLine,
  Loader2,
} from "lucide-react";
import React from 'react';

// Placeholder for ScrollArea for demonstration purposes.
// In your project, this would be imported from "@/src/components/ui/scroll-area".
const ScrollArea = ({ children, className }) => (
  <div className={`overflow-auto ${className}`}>{children}</div>
);

// Placeholder for ScrollBar for demonstration purposes.
// In your project, this would be imported from "@/src/components/ui/scroll-area".
// This component is no longer used, but kept for context if you have it in your actual setup
const ScrollBar = ({ orientation }) => (
  <div className={`bg-gray-300 h-1 rounded-full ${orientation === 'horizontal' ? 'w-full' : 'h-full'}`} />
);

// Placeholder for cn utility for demonstration purposes.
// In your project, this would be imported from "@/src/lib/utils".
const cn = (...classes) => classes.filter(Boolean).join(' ');


interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const tabs: Tab[] = [
  { id: "job", label: "Job", icon: Briefcase },
  { id: "deep-search", label: "DeepSearch", icon: Search },
  { id: "company-search", label: "CompanySearch", icon: Building2 },
  { id: "interview", label: "Interview Preparation", icon: ClipboardList },
  { id: "resume", label: "Resume Builder", icon: FileSignature },
  { id: "cover-letter", label: "Cover Letter", icon: PenLine },
  { id: "analytics", label: "Analytics", icon: BarChart3, disabled: false },
  { id: "career-intelligence", label: "Career Intelligence", icon: BookOpen },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  runningAgents: string[];
  completedAgents: string[];
  viewedTabs?: string[];
  erroredAgents?: string[];
}

export const NavigationTabs = ({
  activeTab = "job",
  onTabChange = (tabId) => console.log("Tab changed to:", tabId),
  runningAgents = [],
  completedAgents = [],
  viewedTabs = [],
  erroredAgents = [],
}: NavigationTabsProps) => {
  return (
    <div className="border-b border-workspace-border">
      <ScrollArea className="w-full">
        <div className="flex justify-around w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isRunning = runningAgents.includes(tab.id);
            const isCompleted = completedAgents.includes(tab.id);
            const isViewed = viewedTabs.includes(tab.id);
            const isErrored = erroredAgents.includes(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!tab.disabled) onTabChange(tab.id);
                }}
                className={cn(
                  "flex flex-col items-center px-2 py-3 relative group",
                  "transition-colors duration-300 ease-in-out",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={tab.disabled}
                type="button"
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-4 h-4 mb-1",
                      isActive ? "text-white" : "text-gray-500"
                    )}
                  />

                  {isErrored && (
                    <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
                  )}

                  {!isErrored && isRunning && (
                    <div className="absolute -top-1 -right-1.5">
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-500" />
                    </div>
                  )}

                  {isCompleted && !isRunning && !isViewed && !isErrored && (
                    <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
                  )}

                  {tab.disabled && (
                    <span className="absolute -top-2 -right-6 bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                      Soon
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-white" : "text-gray-500"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5CE1E6] transition-all duration-300 ease-in-out" />
                )}
              </button>
            );
          })}
        </div>
        {/* REMOVED: <ScrollBar orientation="horizontal" /> */}
      </ScrollArea>
    </div>
  );
};