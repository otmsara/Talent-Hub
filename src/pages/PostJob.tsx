import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../components/ui/quill-dark.css";
import { useNavigate, useParams } from "react-router-dom";
import { useJobs } from "../contexts/JobContext";
import { toast } from "sonner";
import { useAccount } from "@/contexts/AccountContext";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const defaultPhases = [
  {
    title: "Phase 1: React Component Challenge",
    description:
      "Create a responsive navigation component with dropdown menus using React and CSS. The component should adapt to different screen sizes and support keyboard navigation.",
    deadline: "2023-07-15",
  },
  {
    title: "",
    description: "",
    deadline: "",
  },
  {
    title: "",
    description: "",
    deadline: "",
  },
];

const PostJob = () => {
  // Modal state for job description editing
  const [jobDescModalOpen, setJobDescModalOpen] = useState(false);
  const [jobDescModalValue, setJobDescModalValue] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { jobs, addJob, removeJob } = useJobs();
  const { currentUser } = useAccount();

  // If editing, find the job
  const editingJob = id ? jobs.find((job) => job.id === id) : undefined;

  const [jobTitle, setJobTitle] = useState(editingJob?.title || "Senior Frontend Developer");
  const [jobDescription, setJobDescription] = useState(
    editingJob?.description ||
      "We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks. The ideal candidate will have 3+ years of experience building responsive web applications and a strong portfolio of past work."
  );
  const [jobType, setJobType] = useState(jobTypes[0]);
  const [location, setLocation] = useState(editingJob?.location || "Remote");
  const [minSalary, setMinSalary] = useState(editingJob?.minSalary || "80000");
  const [maxSalary, setMaxSalary] = useState(editingJob?.maxSalary || "120000");
  const [projectBased, setProjectBased] = useState(editingJob?.projectBased ?? true);
  const [phases, setPhases] = useState(editingJob?.phases || defaultPhases);
  const [activePhase, setActivePhase] = useState(0);
  const [aiGenerated, setAiGenerated] = useState(false);

  // Modal state for phase description editing
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [descModalValue, setDescModalValue] = useState("");
  const [descModalPhaseIdx, setDescModalPhaseIdx] = useState<number | null>(null);

  const emptyPhases = [
    { title: "", description: "", deadline: "" },
    { title: "", description: "", deadline: "" },
    { title: "", description: "", deadline: "" },
  ];

  const aiPhases = [
    {
      title: "Phase 1: React Component Challenge",
      description:
        "Create a responsive navigation component with dropdown menus using React and CSS. The component should adapt to different screen sizes and support keyboard navigation.",
      deadline: "2023-07-15",
    },
    {
      title: "Phase 2: API Integration",
      description:
        "Integrate a public API to fetch and display data in the application. Ensure error handling and loading states are managed.",
      deadline: "2023-07-22",
    },
    {
      title: "Phase 3: Testing & Optimization",
      description:
        "Write unit and integration tests for the developed features. Optimize performance and accessibility.",
      deadline: "2023-07-29",
    },
  ];

  const handlePhaseChange = (idx: number, field: string, value: string) => {
    setPhases((prev) =>
      prev.map((phase, i) =>
        i === idx ? { ...phase, [field]: value } : phase
      )
    );
  };

  // Open modal for editing phase description
  const openDescModal = (idx: number) => {
    setDescModalPhaseIdx(idx);
    setDescModalValue(phases[idx].description);
    setDescModalOpen(true);
  };

  // Save modal changes
  const saveDescModal = () => {
    if (descModalPhaseIdx !== null) {
      handlePhaseChange(descModalPhaseIdx, "description", descModalValue);
    }
    setDescModalOpen(false);
  };

  const handleProjectBasedToggle = () => {
    if (!projectBased) {
      setPhases(emptyPhases);
      setAiGenerated(false);
    }
    setProjectBased((v) => !v);
  };

  const handleGenerateAIPhases = () => {
    setPhases(aiPhases);
    setAiGenerated(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-2 md:px-8 flex flex-col gap-8">
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Create a <span className="text-cyan-400">Job Post</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Post a new job and find the perfect candidate with our AI-driven recruitment platform.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Form */}
        <form
          className="flex-1 bg-background/40 border border-border rounded-xl shadow p-6 flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingJob) {
              // Remove old job and add updated job (simulate update)
              removeJob(editingJob.id);
              addJob({
                ...editingJob,
                title: jobTitle,
                company: currentUser?.company || currentUser?.name || "Unknown Company",
                location,
                description: jobDescription,
                logo: editingJob.logo || "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg",
                posted: editingJob.posted || "just now",
                minSalary,
                maxSalary,
                projectBased,
                phases: projectBased ? phases : undefined,
              });
              toast.success("Job successfully updated!", {
                description: "Your job has been updated.",
                duration: 3500,
                position: "top-center",
                style: {
                  background: "#0C112A",
                  color: "#22d3ee",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 16px 0 #22d3ee44"
                }
              });
            } else {
              addJob({
                id: "",
                title: jobTitle,
                company: currentUser?.company || currentUser?.name || "Unknown Company",
                location,
                description: jobDescription,
                logo: "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg",
                posted: "just now",
                minSalary,
                maxSalary,
                projectBased,
                phases: projectBased ? phases : undefined,
              });
              toast.success("Job successfully posted!", {
                description: "Your job is now live in the Talent Hub.",
                duration: 3500,
                position: "top-center",
                style: {
                  background: "#0C112A",
                  color: "#22d3ee",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 16px 0 #22d3ee44"
                }
              });
            }
            setTimeout(() => {
              navigate("/talent-hub");
            }, 400);
          }}
        >
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-foreground mb-1 flex items-center gap-2">
              Job Description <span className="text-red-500">*</span>
              <button
                type="button"
                className="ml-2 p-1 rounded hover:bg-cyan-400/20 transition"
                aria-label="Expand job description"
                onClick={() => {
                  setJobDescModalValue(jobDescription);
                  setJobDescModalOpen(true);
                }}
              >
                <svg width="18" height="18" fill="none" stroke="#22d3ee" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </button>
            </label>
            <ReactQuill
              theme="snow"
              value={jobDescription}
              onChange={setJobDescription}
              modules={{
                toolbar: false
              }}
              readOnly
              className="rounded-lg border-none min-h-[80px] bg-secondary/30"
              style={{ pointerEvents: "none", minHeight: "80px" }}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold text-foreground mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
              >
                {jobTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-foreground mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold text-foreground mb-1">
                Minimum Salary (Optional)
              </label>
              <input
                type="number"
                className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-foreground mb-1">
                Maximum Salary (Optional)
              </label>
              <input
                type="number"
                className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                min={0}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={projectBased}
              onChange={handleProjectBasedToggle}
              id="project-based"
              className="accent-cyan-400 w-5 h-5"
            />
            <label htmlFor="project-based" className="text-foreground font-medium">
              Enable project-based application process
            </label>
          </div>
          {projectBased && (
            <div>
              {!aiGenerated && (
                <button
                  type="button"
                  className="mb-4 px-5 py-2 rounded-full font-semibold transition bg-cyan-400/20 text-cyan-200 shadow hover:bg-cyan-400/30"
                  style={{ textShadow: "0 0 6px #22d3ee" }}
                  onClick={handleGenerateAIPhases}
                >
                  Generate project phases with AI
                </button>
              )}
              <h3 className="font-semibold text-foreground mb-2">Project Phases</h3>
              <div className="flex gap-2 mb-4">
                {["Phase 1", "Phase 2", "Phase 3"].map((label, idx) => (
                  <button
                    type="button"
                    key={label}
                    className={`px-4 py-1 rounded-full font-semibold transition ${
                      activePhase === idx
                        ? "bg-cyan-400/80 text-white shadow"
                        : "bg-secondary/30 text-cyan-200 hover:bg-cyan-400/20"
                    }`}
                    onClick={() => setActivePhase(idx)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    {`Phase ${activePhase + 1} Title`}
                  </label>
                  <input
                    className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    value={phases[activePhase].title}
                    onChange={(e) =>
                      handlePhaseChange(activePhase, "title", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1 flex items-center gap-2">
                    {`Phase ${activePhase + 1} Description`}
                    <button
                      type="button"
                      className="ml-2 p-1 rounded hover:bg-cyan-400/20 transition"
                      aria-label="Expand description"
                      onClick={() => openDescModal(activePhase)}
                    >
                      <svg width="18" height="18" fill="none" stroke="#22d3ee" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                    </button>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={phases[activePhase].description}
                    onChange={val => handlePhaseChange(activePhase, "description", val)}
                    modules={{
                      toolbar: false
                    }}
                    readOnly
                    className="rounded-lg border-none min-h-[60px] bg-secondary/30"
                    style={{ pointerEvents: "none", minHeight: "60px" }}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg bg-secondary/30 text-foreground border-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    value={phases[activePhase].deadline}
                    onChange={(e) =>
                      handlePhaseChange(activePhase, "deadline", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4">
            <button
              type="button"
              className="w-full md:flex-1 px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 bg-cyan-400/10 text-cyan-200 shadow hover:bg-cyan-400/20"
              style={{ textShadow: "0 0 6px #22d3ee" }}
              onClick={() => alert("Draft saved! (Demo only)")}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="w-full md:flex-1 px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40"
              style={{ textShadow: "0 0 6px #22d3ee" }}
            >
              <span className="flex items-center justify-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M2 12l9 9 11-11"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Publish Job
              </span>
            </button>
          </div>
        </form>
        {/* Sidebar */}
        <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-background/40 border border-border rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Tips for Job Posting</h3>
            <ul className="list-disc pl-5 text-foreground space-y-2">
              <li>Be specific about job responsibilities and requirements</li>
              <li>Include salary information to attract more candidates</li>
              <li>
                For project-based applications, create clear and challenging tasks
              </li>
              <li>Set reasonable deadlines for each phase</li>
            </ul>
          </div>
          <div className="bg-background/40 border border-border rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Project-Based Applications</h3>
            <ol className="list-decimal pl-5 text-foreground space-y-2">
              <li>Enable project-based applications</li>
              <li>Define tasks for each of the three phases</li>
              <li>Set deadlines for each phase</li>
              <li>Our AI will evaluate and rank candidates</li>
              <li>Choose the best candidate based on their performance</li>
            </ol>
          </div>
        </div>
      </div>
      {/* Modal for editing job description */}
      {jobDescModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background border border-border rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-cyan-400 hover:text-red-400 transition"
              aria-label="Close"
              onClick={() => setJobDescModalOpen(false)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Edit Job Description</h2>
            <div className="max-h-[60vh] overflow-y-auto">
              <ReactQuill
                theme="snow"
                value={jobDescModalValue}
                onChange={setJobDescModalValue}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-5 py-2 rounded-full font-semibold transition bg-cyan-400/30 text-cyan-200 shadow hover:bg-cyan-400/40"
                style={{ textShadow: "0 0 6px #22d3ee" }}
                onClick={() => {
                  setJobDescription(jobDescModalValue);
                  setJobDescModalOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for editing phase description */}
      {descModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background border border-border rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-cyan-400 hover:text-red-400 transition"
              aria-label="Close"
              onClick={() => setDescModalOpen(false)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Edit Phase Description</h2>
            <div className="max-h-[60vh] overflow-y-auto">
              <ReactQuill
                theme="snow"
                value={descModalValue}
                onChange={setDescModalValue}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-5 py-2 rounded-full font-semibold transition bg-cyan-400/30 text-cyan-200 shadow hover:bg-cyan-400/40"
                style={{ textShadow: "0 0 6px #22d3ee" }}
                onClick={saveDescModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;
