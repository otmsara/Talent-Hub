import React, { useState } from "react";
import { Bookmark, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkspaceSettings } from "./WorkspaceSettings";
import { Button } from "@/components/ui/button";
import { SavedJobsDialog } from "./SavedJobsDialog";

interface WorkspaceHeaderProps {
  selectedJobTitle?: string | null;
}

export const WorkspaceHeader = ({ selectedJobTitle }: WorkspaceHeaderProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedJobsOpen, setIsSavedJobsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-6 border-b border-workspace-border font-landpage">
      <h1 className="text-2xl text-workspace-text">
        Career Workspace
        {selectedJobTitle && (
          <span className="text-lg text-gray-500 ml-3">
            - {selectedJobTitle}
          </span>
        )}
      </h1>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-workspace-hover rounded-lg transition-colors"
          onClick={() => setIsSavedJobsOpen(true)}
          aria-label="Saved Jobs"
        >
          <Bookmark className="w-5 h-5 text-workspace-muted" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 hover:bg-workspace-hover rounded-lg transition-colors"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-workspace-muted" />
        </Button>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Workspace Settings</DialogTitle>
          </DialogHeader>
          <WorkspaceSettings
            onClose={() => setIsSettingsOpen(false)}
            onResumeUploaded={(file) => console.log("Resume uploaded:", file)}
          />
        </DialogContent>
      </Dialog>

      <SavedJobsDialog
        isOpen={isSavedJobsOpen}
        onOpenChange={setIsSavedJobsOpen}
      />
    </div>
  );
};