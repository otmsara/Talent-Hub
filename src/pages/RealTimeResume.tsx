import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { currentUser, projects as getProjects } from "../data/dummyData";

interface ManualEntry {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

interface ResumeFile {
  name: string;
  url: string;
  uploadedAt: Date;
  checked: boolean;
}

const RealTimeResume: React.FC = () => {
  // Resume upload state
  const [resume, setResume] = useState<ResumeFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual entries state
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Arya projects (auto-pulled)
  const userId = currentUser.id;
  const aryaProjects = getProjects().filter(
    (p) =>
      (Array.isArray(p.collaborators) && p.collaborators.includes(userId)) ||
      p.userId === userId
  );
  const [projectChecks, setProjectChecks] = useState<{ [id: string]: boolean }>(
    Object.fromEntries(aryaProjects.map((p) => [p.id, true]))
  );

  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setResume({
      name: file.name,
      url,
      uploadedAt: new Date(),
      checked: true,
    });
  };

  // Add manual entry
  const handleAddManual = () => {
    if (!newTitle.trim() && !newDesc.trim()) return;
    setManualEntries([
      ...manualEntries,
      {
        id: Math.random().toString(36).slice(2),
        title: newTitle,
        description: newDesc,
        checked: true,
      },
    ]);
    setNewTitle("");
    setNewDesc("");
  };

  // Toggle manual entry checkbox
  const handleManualCheck = (id: string) => {
    setManualEntries((entries) =>
      entries.map((e) =>
        e.id === id ? { ...e, checked: !e.checked } : e
      )
    );
  };

  // Edit manual entry (for simplicity, only delete here)
  const handleDeleteManual = (id: string) => {
    setManualEntries((entries) => entries.filter((e) => e.id !== id));
  };

  // Toggle project checkbox
  const handleProjectCheck = (id: string) => {
    setProjectChecks((checks) => ({
      ...checks,
      [id]: !checks[id],
    }));
  };

  // Toggle resume checkbox
  const handleResumeCheck = () => {
    if (resume) setResume({ ...resume, checked: !resume.checked });
  };

  // Generate resume (for now, just show a preview)
  const [generated, setGenerated] = useState<string | null>(null);
  const handleGenerate = () => {
    let content = "";
    if (resume && resume.checked) {
      content += `--- Uploaded Resume: ${resume.name} (uploaded ${resume.uploadedAt.toLocaleString()}) ---\n[Resume file attached]\n\n`;
    }
    if (manualEntries.some((e) => e.checked)) {
      content += "Manual Work Entries:\n";
      manualEntries
        .filter((e) => e.checked)
        .forEach((e) => {
          content += `- ${e.title}\n  ${e.description}\n`;
        });
      content += "\n";
    }
    if (aryaProjects.some((p) => projectChecks[p.id])) {
      content += "Arya Projects:\n";
      aryaProjects
        .filter((p) => projectChecks[p.id])
        .forEach((p) => {
          content += `- ${p.name || p.text || "Untitled Project"}\n  Status: ${p.status || "In progress"}\n`;
        });
    }
    setGenerated(content || "No entries selected.");
  };

  return (
    <div className="w-full max-w-full mx-auto py-10 px-2 sm:px-4 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-foreground mb-6 text-center">Real-Time Resume Builder</h1>
      {/* Resume upload */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Latest Uploaded Resume</h2>
        {resume ? (
          <div className="flex items-center gap-4 mb-2">
            <input
              type="checkbox"
              checked={resume.checked}
              onChange={handleResumeCheck}
              className="accent-cyan-500"
            />
            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-cyan-200"
            >
              {resume.name}
            </a>
            <span className="text-xs text-muted-foreground">
              Uploaded: {resume.uploadedAt.toLocaleString()}
            </span>
          <Button
            className="ml-2"
            variant="default"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Re-upload
          </Button>
          </div>
        ) : (
        <Button
          variant="default"
          size="default"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Resume
        </Button>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleResumeUpload}
        />
      </div>
      {/* Manual entries */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Manual Work Entries</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            className="flex-1 px-2 py-1 rounded border border-border bg-white/10 text-foreground"
            placeholder="Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            className="flex-1 px-2 py-1 rounded border border-border bg-white/10 text-foreground"
            placeholder="Description"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <Button
            variant="default"
            size="sm"
            onClick={handleAddManual}
          >
            Add
          </Button>
        </div>
        <ul className="grid gap-2">
          {manualEntries.map((entry) => (
            <li key={entry.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/5 rounded p-2">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="checkbox"
                  checked={entry.checked}
                  onChange={() => handleManualCheck(entry.id)}
                  className="accent-cyan-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{entry.title}</div>
                  <div className="text-sm text-muted-foreground">{entry.description}</div>
                </div>
                <Button
                  className="ml-2 text-xs"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteManual(entry.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Arya projects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-white">Qolabs Projects</h2>
        <ul className="grid gap-2">
          {aryaProjects.map((p) => (
            <li key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/5 rounded p-2">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="checkbox"
                  checked={!!projectChecks[p.id]}
                  onChange={() => handleProjectCheck(p.id)}
                  className="accent-cyan-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{p.name || p.text || "Untitled Project"}</div>
                  <div className="text-sm text-muted-foreground">Status: {p.status || "In progress"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Generate Resume */}
      <div className="mb-8">
        <Button
          variant="default"
          size="default"
          onClick={handleGenerate}
        >
          Generate Resume
        </Button>
      </div>
      {/* Generated preview */}
      {generated && (
        <div className="bg-white/10 border border-cyan-700/40 rounded-2xl shadow p-4 sm:p-6 mt-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">Generated Resume Preview</h2>
          <pre className="whitespace-pre-wrap text-foreground text-sm">{generated}</pre>
        </div>
      )}
    </div>
  );
};

export default RealTimeResume;
