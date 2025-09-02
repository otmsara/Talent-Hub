import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface JobApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  open,
  onOpenChange,
  jobTitle,
}) => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle application submission
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <form
          onSubmit={handleSubmit}
          className="bg-background rounded-lg p-8 border border-border shadow-lg w-full"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              Apply for {jobTitle}
            </DialogTitle>
            <DialogDescription className="mb-4">
              Please fill out the form below to submit your application.
            </DialogDescription>
          </DialogHeader>
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
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-2"
                onChange={handleResumeChange}
                required
              />
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
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-2 rounded font-semibold bg-muted text-foreground hover:bg-muted/80 transition"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="px-6 py-2 rounded font-semibold bg-primary text-white hover:bg-primary/90 transition"
            >
              Submit Application
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
