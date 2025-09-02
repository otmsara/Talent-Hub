import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./_ui/dialog";
import { useResume } from "@/contexts/ResumeContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileText, Upload, X } from "lucide-react";

export interface ResumeUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onResumeUploaded: (file: File, parsedData: any) => Promise<void>;
}

export const ResumeUploadDialog = ({
  isOpen,
  onOpenChange,
  onResumeUploaded,
}: ResumeUploadDialogProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addResume } = useResume();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://streamlit-arya-g6bpacfngad0h9gj.francecentral-01.azurewebsites.net/resume_parser",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const parsedData = response.data;
        await addResume(file, parsedData);
        await onResumeUploaded(file, parsedData);
        toast({
          title: "Resume uploaded successfully",
          description: `Your resume "${file.name}" has been processed and is ready to use.`,
        });
        onOpenChange(false);
      } else {
        throw new Error("Failed to parse resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        variant: "destructive",
        title: "Resume upload failed",
        description: "There was an error parsing your resume. Please try again.",
      });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !file) return;
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[600px]" showClose={!!file}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Upload Your Resume
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center space-y-4">
          {!file ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-10 transition-all duration-200 cursor-pointer",
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-workspace-border hover:border-workspace-accent"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                document.getElementById("resume-file-input")?.click()
              }
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-lg">Upload your resume</h3>
                <p className="text-sm text-workspace-muted max-w-sm">
                  Drag and drop your resume file here, or click to browse.
                </p>
                <p className="text-xs text-workspace-muted mt-2">
                  Supported formats: PDF, DOCX, DOC (Max 5MB)
                </p>
                <input
                  id="resume-file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-workspace-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-workspace-muted" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Button
              className="w-full flex items-center gap-2"
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};