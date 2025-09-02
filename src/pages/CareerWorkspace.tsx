"use client"

import { NavigationTabs } from "../components/careerworkspace/NavigationTabs"
import { WorkspaceContent } from "../components/careerworkspace/WorkspaceContent"
import { useCareerWorkspace, CareerWorkspaceProvider } from "@/contexts/CareerWorkspaceToggler"
import { ResumeProvider } from "@/contexts/ResumeContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { SavedJobsProvider } from "@/contexts/SavedJobsContext"
import { useState, useEffect } from "react"
import { WorkspaceHeader } from "../components/careerworkspace/WorkspaceHeader"

export default function CareerWorkspace() {
  const [activeTab, setActiveTab] = useState("job")
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      document.body.style.paddingBottom = "0"
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-full">
      <CareerWorkspaceProvider>
        <SavedJobsProvider>
          <SettingsProvider>
            <ResumeProvider>
              {/* Workspace Header with built-in settings dialog */}
              <WorkspaceHeader selectedJobTitle={selectedJobTitle} />
              
              {/* Main content area */}
              <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col overflow-hidden">
                  {/* Full-width navigation tabs */}
                  <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
                  
                  {/* Content area with all providers */}
                  <div className="flex-1 overflow-hidden">
                            <WorkspaceContent 
                              activeTab={activeTab} 
                              onJobTitleSelect={setSelectedJobTitle}
                            />
                  </div>
                </main>
              </div>
            </ResumeProvider>
          </SettingsProvider>
        </SavedJobsProvider>
      </CareerWorkspaceProvider>
      
    </div>
  )
}