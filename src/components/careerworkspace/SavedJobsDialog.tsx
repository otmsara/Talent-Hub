import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { JobPosting, useSavedJobs } from "@/hooks/use-saved-jobs";
import { JobDetailsDialog } from "./JobDetailsDialog";

interface SavedJobsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SavedJobsDialog = ({
  isOpen,
  onOpenChange,
}: SavedJobsDialogProps) => {
  const { savedJobs, removeSavedJob } = useSavedJobs();
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [runningAgents, setRunningAgents] = useState<Record<number, boolean>>(
    {}
  );

  const runAgents = (jobId: number) => {
    setRunningAgents((prev) => ({ ...prev, [jobId]: true }));

    setTimeout(() => {
      setRunningAgents((prev) => ({ ...prev, [jobId]: false }));
    }, 20000);
  };

  const openJobDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  if (savedJobs.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Saved Jobs</DialogTitle>
          </DialogHeader>
          <div className="py-16 text-center">
            <h3 className="text-lg font-medium text-workspace-muted mb-2">
              No saved jobs yet
            </h3>
            <p className="text-workspace-muted mb-6">
              Start saving jobs you're interested in to access them later
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Jobs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border border-workspace-border rounded-lg hover:border-workspace-accent transition-all duration-200 cursor-pointer"
                onClick={() => {
                  openJobDetails(job);
                  onOpenChange(false);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-workspace-text">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="w-4 h-4 text-workspace-muted" />
                      <span className="text-workspace-text">{job.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-0.5",
                        job.matchScore >= 90
                          ? "bg-green-100 text-green-800 border-green-200"
                          : job.matchScore >= 80
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      )}
                    >
                      {job.matchScore}% Match
                    </Badge>
                    <Toggle
                      pressed={true}
                      onPressedChange={(pressed) => {
                        if (event) event.stopPropagation();
                        removeSavedJob(job.id);
                      }}
                      aria-label="Remove from saved jobs"
                      className="data-[state=on]:text-rose-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Toggle>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-workspace-muted mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.posted}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://example.com/jobs/${job.id}`,
                        "_blank"
                      );
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add the job details dialog for the selected job */}
      {selectedJob && (
        <JobDetailsDialog
          job={selectedJob}
          isOpen={isJobDetailsOpen}
          onOpenChange={setIsJobDetailsOpen}
          onRunAgents={runAgents}
          isAgentRunning={runningAgents[selectedJob.id] || false}
        />
      )}
    </>
  );
};