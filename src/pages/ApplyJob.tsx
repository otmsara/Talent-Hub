import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "@/contexts/JobContext";
import { useAccount } from "@/contexts/AccountContext";
import { toast } from "sonner";

const ApplyJob: React.FC = () => {
  const { jobId, phaseIndex: phaseIndexParam } = useParams<{ jobId: string; phaseIndex?: string }>();
  const { jobs, addApplication } = useJobs();
  const { currentUser } = useAccount();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === jobId);
  // Determine which phase to show (default 0)
  const phaseIndex = job?.projectBased && phaseIndexParam ? parseInt(phaseIndexParam, 10) : 0;

  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Project-based phase answer state
  const [phaseAnswer, setPhaseAnswer] = useState("");
  const [phaseFiles, setPhaseFiles] = useState<File[]>([]);

  const handlePhaseFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhaseFiles(Array.from(e.target.files));
    }
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-2">Job Not Found</h2>
        <button
          className="px-6 py-2 rounded font-semibold bg-primary text-white hover:bg-primary/90 transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !job) return;

    addApplication({
      id: "",
      jobId: job.id,
      userId: currentUser.id,
      userName: currentUser.name,
      email,
      phone,
      linkedin,
      coverLetter,
      resumeName,
      // resumeFile: resume, // File objects can't be stored in state, so just store name
      phaseAnswer: job.projectBased ? phaseAnswer : undefined,
      phaseFiles: job.projectBased ? phaseFiles.map(f => f.name) : undefined,
      submittedAt: "",
      phaseIndex: job.projectBased ? 0 : undefined,
    });

    toast.success("Your application has been submitted!");
    setTimeout(() => {
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-2 md:px-0">
      <h1 className="text-3xl font-bold text-white mb-2">
        Apply for {job.title}
      </h1>
      <div className="text-muted-foreground mb-6">
        at {job.location}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-background rounded-lg p-8 border border-border shadow-lg w-full"
      >
        {/* Project-based Recruitment Phase 1 */}
        {job.projectBased && Array.isArray(job.phases) && job.phases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-200 mb-2">
              {job.phases[phaseIndex]?.title || `Phase ${phaseIndex + 1}`}
            </h2>
            <div className="mb-4 prose prose-invert max-w-none text-purple-100" dangerouslySetInnerHTML={{ __html: job.phases[phaseIndex]?.description || "" }} />
            <div className="mb-4 text-xs text-cyan-200 font-semibold">
              Submission Deadline: {job.phases[phaseIndex]?.deadline || ""}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-white">
                Your Answer (Text)
              </label>
              <textarea
                className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white min-h-[80px]"
                value={phaseAnswer}
                onChange={e => setPhaseAnswer(e.target.value)}
                placeholder="Write your answer for this phase..."
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-white">
                Upload Files (optional)
              </label>
              <label className="inline-block px-5 py-2 rounded-full font-semibold cursor-pointer bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40 transition"
                style={{ textShadow: "0 0 6px #22d3ee" }}>
                Choose File(s)
                <input
                  type="file"
                  multiple
                  onChange={handlePhaseFilesChange}
                  className="hidden"
                />
              </label>
              {phaseFiles.length > 0 && (
                <ul className="mt-2 text-sm text-cyan-200">
                  {phaseFiles.map(f => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <hr className="my-6 border-border" />
          </div>
        )}
        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-white">
            Resume/CV <span className="text-red-400">*</span>
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col gap-2 bg-background/60">
            {resumeName ? (
              <span className="text-cyan-300 font-medium">{resumeName}</span>
            ) : (
              <span className="text-muted-foreground text-sm">
                Upload your resume (PDF, DOCX)
              </span>
            )}
            <label className="inline-block px-5 py-2 rounded-full font-semibold cursor-pointer bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40 transition"
              style={{ textShadow: "0 0 6px #22d3ee" }}>
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
                required
              />
            </label>
          </div>
        </div>
        {/* Name/Email */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">
              Full Name
            </label>
            <input
              type="text"
              className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        {/* Phone/LinkedIn */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">
              LinkedIn Profile
            </label>
            <input
              type="url"
              className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
        {/* Cover Letter */}
        <div className="mb-6">
          <label className="block font-semibold mb-1 text-white">
            Cover Letter <span className="text-red-400">*</span>
          </label>
          <textarea
            className="w-full rounded border border-border bg-background/80 px-3 py-2 text-white min-h-[100px]"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            required
            placeholder="I am excited to apply for the position..."
          />
        </div>
        <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 mt-4">
          <button
            type="button"
            className="w-full md:w-auto px-6 py-2 rounded font-semibold bg-muted text-foreground hover:bg-muted/80 transition"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40"
            style={{ textShadow: "0 0 6px #22d3ee" }}
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyJob;
