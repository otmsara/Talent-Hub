import React, { useState } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../contexts/JobContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

const TalentHub = () => {
  const { currentUser } = useAccount();
  const navigate = useNavigate();
  const { jobs, removeJob, updateApplication } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [tab, setTab] = useState<"feed" | "current" | "applicants" | "applications" | "saved">("feed");

  const isEnterprise =
    currentUser?.subscription?.type &&
    currentUser.subscription.type.toLowerCase() === "enterprise";

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-2 md:px-6 flex flex-col gap-6">
      {/* Top Bar: Responsive Stack */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-white mb-2 sm:mb-0">Talent Hub</h1>
        {isEnterprise ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-background/60 rounded-full border border-border overflow-hidden w-full sm:w-auto">
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "feed" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("feed")}
              >
                Job Feed
              </button>
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "current" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("current")}
              >
                Current Jobs
              </button>
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "applicants" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("applicants")}
              >
                Applicants
              </button>
            </div>
            <button
              className="w-full sm:w-auto px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40"
              style={{ textShadow: '0 0 6px #22d3ee' }}
              onClick={() => navigate("/postjob")}
            >
              Post Job
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-background/60 rounded-full border border-border overflow-hidden w-full sm:w-auto">
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "feed" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("feed")}
              >
                Job Feed
              </button>
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "applications" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("applications")}
              >
                My Applications
              </button>
              <button
                className={`w-full sm:w-auto px-5 py-2 font-semibold transition ${tab === "saved" ? "bg-cyan-400/30 text-cyan-200" : "text-white hover:bg-cyan-400/10"}`}
                onClick={() => setTab("saved")}
              >
                Saved Jobs
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Main Content: Responsive Stack */}
      <div className="flex flex-col md:flex-row flex-1 gap-6 min-h-[500px]">
        {tab === "feed" && (
          <>
            {/* Job List */}
            <div className="w-full md:w-1/2 max-w-md min-h-[600px] md:min-h-[700px] bg-background/40 border border-border rounded-lg shadow flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-white">Job Feed</h2>
              </div>
              <ul className="flex-1 overflow-y-auto divide-y divide-border">
                {jobs.map((job) => (
                  <li
                    key={job.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      selectedJobId === job.id
                        ? "bg-accent/20 border-l-4 border-primary"
                        : "hover:bg-accent/10"
                    }`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-md object-cover border border-border bg-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate flex items-center gap-2">
                        {job.title}
                        {job.projectBased && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-800/20 text-purple-200 border border-purple-600">
                            Project-Based
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.company} &middot; {job.location}
                      </p>
                      <p className="text-xs text-muted-foreground">{job.posted}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Job Details */}
            <div className="flex-1 bg-background/40 border border-border rounded-lg shadow p-6 flex flex-col min-w-0 min-h-[600px] md:min-h-[700px] max-h-[80vh] overflow-y-auto">
              {selectedJob ? (
                <>
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={selectedJob.logo}
                      alt={selectedJob.company}
                      className="w-14 h-14 rounded-md object-cover border border-border bg-white/10"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {selectedJob.title}
                        {selectedJob.projectBased && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-800/20 text-purple-200 border border-purple-600">
                            Project-Based
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedJob.company} &middot; {selectedJob.location}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedJob.posted}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-foreground">
                    <h3 className="font-semibold mb-1">Job Description</h3>
<div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                  </div>
                  <div className="mt-6">
                    <button
                      className="px-5 py-2 rounded-full font-semibold transition disabled:opacity-50 bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40"
                      style={{ textShadow: '0 0 6px #22d3ee' }}
                      onClick={() => navigate(`/apply/${selectedJob.id}`)}
                    >
                      Apply
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a job to view details.
                </div>
              )}
            </div>
          </>
        )}
        {tab === "current" && (
          <div className="w-full bg-background/40 border border-border rounded-lg shadow p-6 flex flex-col min-w-0">
            <h2 className="text-lg font-semibold text-white mb-4">Current Jobs</h2>
            {(() => {
              const companyName = (currentUser as any)?.company || currentUser?.name || "";
              const companyJobs = jobs.filter(
                (job) => job.company === companyName
              );
              if (companyJobs.length === 0) {
                return (
                  <div className="text-muted-foreground">
                    No jobs posted by your company yet.
                  </div>
                );
              }
              return (
                <ul className="divide-y divide-border">
                  {companyJobs.map((job) => (
                    <li key={job.id} className="flex items-center gap-4 py-4">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-md object-cover border border-border bg-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {job.location}
                        </p>
                        <p className="text-xs text-muted-foreground">{job.posted}</p>
                      </div>
                      {/* Placeholder for edit/delete actions */}
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded bg-cyan-400/20 text-cyan-200 font-semibold hover:bg-cyan-400/30 transition"
                          title="Edit"
                          onClick={() => navigate(`/postjob/${job.id}`)}
                        >
                          Edit
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="px-3 py-1 rounded bg-red-400/20 text-red-200 font-semibold hover:bg-red-400/30 transition"
                              title="Delete"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Job Posting
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this job? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeJob(job.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        )}
        {tab === "applicants" && (
          <div className="w-full bg-background/40 border border-border rounded-lg shadow p-6 flex flex-col min-w-0">
            <h2 className="text-lg font-semibold text-white mb-4">Applicants</h2>
            {(() => {
              const { applications, jobs } = useJobs();
              const { currentUser } = useAccount();
              const myCompany = (currentUser as any)?.company || currentUser?.name || "";
              const myJobs = jobs.filter(j => j.company === myCompany).map(j => j.id);
              const jobApps = applications.filter(app => myJobs.includes(app.jobId));
              if (jobApps.length === 0) {
                return <div className="text-muted-foreground">No applicants for your jobs yet.</div>;
              }
              return (
                <ul className="divide-y divide-border">
                  {jobApps.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    return (
                      <li key={app.id} className="py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-semibold text-white">{app.userName}</div>
                            <div className="text-xs text-muted-foreground">{app.email} {app.phone && <> &middot; {app.phone}</>}</div>
                            <div className="text-xs text-cyan-200">Applied: {new Date(app.submittedAt).toLocaleString()}</div>
                          </div>
                          <div className="ml-6">
                            <div className="font-semibold text-white">{job?.title || "Job"}</div>
                            <div className="text-xs text-muted-foreground">{job?.location}</div>
                          </div>
                        </div>
                          <div className="mt-2 text-sm text-foreground">
                            <div><span className="font-medium">Cover Letter:</span> {app.coverLetter}</div>
                            {app.phaseAnswer && (
                              <div className="mt-1"><span className="font-medium">Phase 1 Answer:</span> {app.phaseAnswer}</div>
                            )}
                            {app.phaseFiles && app.phaseFiles.length > 0 && (
                              <div className="mt-1"><span className="font-medium">Phase 1 Files:</span> {app.phaseFiles.join(", ")}</div>
                            )}
                            <div className="mt-1"><span className="font-medium">Resume:</span> {app.resumeName}</div>
                          </div>
                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          {job?.projectBased && Array.isArray(job.phases) && ((app.phaseIndex ?? 0) < job.phases.length - 1) && app.status !== "hired" && app.status !== "rejected" && (
                            <button
                              className="px-4 py-1 rounded bg-purple-700/30 text-purple-200 font-semibold hover:bg-purple-700/50 transition"
                              onClick={() => {
                                // Move to next phase
                                const nextPhase = (app.phaseIndex ?? 0) + 2;
                                let nextStatus: "phase2" | "phase3" | "in_review" = "in_review";
                                if (nextPhase === 2) nextStatus = "phase2";
                                else if (nextPhase === 3) nextStatus = "phase3";
                                updateApplication(app.id, {
                                  phaseIndex: (app.phaseIndex ?? 0) + 1,
                                  status: nextStatus
                                });
                              }}
                            >
                              Move to Phase {((app.phaseIndex ?? 0) + 2)}
                            </button>
                          )}
                          {app.status !== "hired" && app.status !== "rejected" && (
                            <>
                              <button
                                className="px-4 py-1 rounded bg-green-700/30 text-green-200 font-semibold hover:bg-green-700/50 transition"
                                onClick={() => {
                                  updateApplication(app.id, { status: "hired" });
                                }}
                              >
                                Hire
                              </button>
                              <button
                                className="px-4 py-1 rounded bg-red-700/30 text-red-200 font-semibold hover:bg-red-700/50 transition"
                                onClick={() => {
                                  updateApplication(app.id, { status: "rejected" });
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {/* For non-project-based jobs, only show Hire/Reject */}
                        </div>
                        {/* Status display */}
                        {(app.status === "hired" || app.status === "rejected") && (
                          <div className={`mt-2 text-xs font-bold ${app.status === "hired" ? "text-green-400" : "text-red-400"}`}>
                            {app.status === "hired" ? "HIRED" : "REJECTED"}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>
        )}
        {tab === "applications" && (
          <div className="w-full bg-background/40 border border-border rounded-lg shadow p-6 flex flex-col min-w-0">
            <h2 className="text-lg font-semibold text-white mb-4">My Applications</h2>
            {(() => {
              const { applications, jobs } = useJobs();
              const { currentUser } = useAccount();
              const myApps = applications.filter(app => app.userId === currentUser?.id);
              if (myApps.length === 0) {
                return <div className="text-muted-foreground">You have not applied to any jobs yet.</div>;
              }
              return (
                <ul className="divide-y divide-border">
                  {myApps.map(app => {
                    const job = jobs.find(j => j.id === app.jobId);
                    return (
                      <li key={app.id} className="py-4">
                        <div className="flex items-center gap-4">
                          {job?.logo && (
                            <img src={job.logo} alt={job.title} className="w-10 h-10 rounded object-cover border border-border" />
                          )}
                          <div>
                            <div className="font-semibold text-white">{job?.title || "Job"}</div>
                            <div className="text-xs text-muted-foreground">{job?.company} &middot; {job?.location}</div>
                            <div className="text-xs text-cyan-200">Submitted: {new Date(app.submittedAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-foreground">
                          <div><span className="font-medium">Cover Letter:</span> {app.coverLetter}</div>
                          {app.phaseAnswer && (
                            <div className="mt-1"><span className="font-medium">Phase 1 Answer:</span> {app.phaseAnswer}</div>
                          )}
                          {app.phaseFiles && app.phaseFiles.length > 0 && (
                            <div className="mt-1"><span className="font-medium">Phase 1 Files:</span> {app.phaseFiles.join(", ")}</div>
                          )}
                          <div className="mt-1"><span className="font-medium">Resume:</span> {app.resumeName}</div>
                          {/* Next Phase Button for Project-Based */}
                          {job?.projectBased && (app.status === "phase2" || app.status === "phase3") && (
                            <button
                              className="mt-4 px-4 py-2 rounded-full font-semibold bg-purple-700/30 text-purple-200 shadow hover:bg-purple-700/50 transition"
                              onClick={() => {
                                // Go to next phase apply page
                                const nextPhaseIndex = app.status === "phase2" ? 1 : 2;
                                navigate(`/apply/${job.id}/${nextPhaseIndex}`);
                              }}
                            >
                              🎉 Congrats, go to next phase
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>
        )}
        {tab === "saved" && (
          <div className="w-full bg-background/40 border border-border rounded-lg shadow p-6 flex flex-col min-w-0">
            <h2 className="text-lg font-semibold text-white mb-4">Saved Jobs</h2>
            {/* TODO: List jobs the user has saved */}
            <div className="text-muted-foreground">You have not saved any jobs yet.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentHub;
