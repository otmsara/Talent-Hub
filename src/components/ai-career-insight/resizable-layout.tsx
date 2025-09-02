"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useCareerWorkspace } from "@/contexts/CareerWorkspaceToggler";
import { useEffect, useState } from "react";
import { WorkspaceContent } from "../careerworkspace/WorkspaceContent";
import { WorkspaceHeader } from "../careerworkspace/WorkspaceHeader";
import UploadLogic from "./UploadLogic";
import { NavigationTabs } from "../careerworkspace/NavigationTabs.tsx";

export default function ResizableLayout({ token }: { token: string }) {
  const { isCareerWorkspaceVisible } = useCareerWorkspace();

  // Detect if phone based on window width
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const checkIsPhone = () => setIsPhone(window.innerWidth < 640);
    checkIsPhone();

    window.addEventListener("resize", checkIsPhone);
    return () => window.removeEventListener("resize", checkIsPhone);
  }, []);

  const [uploadPanelSize, setUploadPanelSize] = useState(
    isCareerWorkspaceVisible ? 50 : 100
  );
  const [workspacePanelSize, setWorkspacePanelSize] = useState(50);
  const [previousLayout, setPreviousLayout] = useState<number[]>([50, 50]);
  const [activeTab, setActiveTab] = useState("job");
  const [runningAgents, setRunningAgents] = useState<string[]>([]);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [viewedTabs, setViewedTabs] = useState<string[]>([]); // Track viewed tabs

  // NEW STATE: To hold the selected job title for the header
  const [selectedJobTitleInHeader, setSelectedJobTitleInHeader] = useState<string | null>(null);

  const handleAgentRunning = (agentId: string) => {
    setRunningAgents((prev) => (prev.includes(agentId) ? prev : [...prev, agentId]));
  };

  const handleAgentStopped = (agentId: string) => {
    setRunningAgents((prev) => prev.filter((id) => id !== agentId));
  };

  const handleAgentComplete = (agentId: string) => {
    setRunningAgents((prev) => prev.filter((id) => id !== agentId));
    setCompletedAgents((prev) => (prev.includes(agentId) ? prev : [...prev, agentId]));
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setViewedTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId])); // Mark tab as viewed
  };

  // NEW: Callback to update the selected job title in this parent component
  const handleJobSelectedForHeader = (jobTitle: string) => {
    setSelectedJobTitleInHeader(jobTitle);
  };

  useEffect(() => {
    if (isCareerWorkspaceVisible) {
      setUploadPanelSize(previousLayout[0]);
    } else {
      if (uploadPanelSize !== 100) {
        setPreviousLayout([uploadPanelSize, 100 - uploadPanelSize]);
      }
      setUploadPanelSize(100);
    }
  }, [isCareerWorkspaceVisible, previousLayout, uploadPanelSize]);

  const handleResizeEnd = (sizes: number[]) => {
    setUploadPanelSize(sizes[0]);
    if (sizes.length > 1) {
      setWorkspacePanelSize(sizes[1]);
      setPreviousLayout([sizes[0], sizes[1]]);
    }
  };

  // === Render ===

  if (!isCareerWorkspaceVisible) {
    // CareerWorkspace is hidden, so always show UploadLogic full page
    return (
      <div className="w-full h-full">
        <UploadLogic token={token} />
      </div>
    );
  }

  // CareerWorkspace is visible

  if (isPhone) {
    // Show CareerWorkspace full page only on phone
    return (
      <div className="w-full h-full flex flex-col animate-slide-left">
        {/* Pass the new state to WorkspaceHeader */}
        <WorkspaceHeader selectedJobTitle={selectedJobTitleInHeader} />
        <main className="flex-1 overflow-y-auto">
          <NavigationTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            runningAgents={runningAgents}
            completedAgents={completedAgents}
            viewedTabs={viewedTabs}
          />
          <div className="p-6 flex flex-col h-full">
            <WorkspaceContent
              activeTab={activeTab}
              onAgentComplete={handleAgentComplete}
              onAgentRunning={handleAgentRunning}
              onAgentStopped={handleAgentStopped}
              onTabChange={handleTabChange}
              onJobSelected={handleJobSelectedForHeader} // Pass the callback
            />
          </div>
        </main>
      </div>
    );
  }

  // Desktop or tablet with split panels

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full transition-all duration-200 ease-in-out"
      //onResizeEnd={handleResizeEnd} // Re-enable this if you need resize persistence
    >
      <ResizablePanel
        defaultSize={uploadPanelSize}
        minSize={50}
        className="transition-all duration-200 ease-in-out overflow-hidden"
      >
        <div className="px-7">
          <UploadLogic token={token} />
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        className="transition-opacity duration-200 ease-in-out"
      />

      <ResizablePanel
        defaultSize={workspacePanelSize}
        minSize={66.66}
        maxSize={66.66}
        className="transition-all duration-200 ease-in-out overflow-hidden"
      >
        <div className="h-full animate-slide-left">
          <div className="h-full flex flex-col">
            {/* Pass the new state to WorkspaceHeader */}
            <WorkspaceHeader selectedJobTitle={selectedJobTitleInHeader} />
            <main className="flex-1 overflow-y-auto">
              <NavigationTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                runningAgents={runningAgents}
                completedAgents={completedAgents}
                viewedTabs={viewedTabs}
              />
              <div className="p-6 flex flex-col h-full">
                <WorkspaceContent
                  activeTab={activeTab}
                  onAgentComplete={handleAgentComplete}
                  onAgentRunning={handleAgentRunning}
                  onAgentStopped={handleAgentStopped}
                  onTabChange={handleTabChange}
                  onJobSelected={handleJobSelectedForHeader} // Pass the callback
                />
              </div>
            </main>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}