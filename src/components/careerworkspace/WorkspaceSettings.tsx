import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface WorkspaceSettingsProps {
  onClose: () => void;
}

export const WorkspaceSettings = ({ onClose }: WorkspaceSettingsProps) => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();
  const { uploadedResumes, currentResume, setCurrentResume, addResume } =
    useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedResume, setSelectedResume] = useState<string>(
    currentResume?.name || settings.resume
  );

  // Set default selectedCountry to "global" if settings.country is empty or undefined
  const [selectedCountry, setSelectedCountry] = useState<string>(
    settings.country && settings.country !== "" ? settings.country : "global"
  );

  const [remoteOnly, setRemoteOnly] = useState<boolean>(true); // Default to true
  const [uploadingResume, setUploadingResume] = useState<boolean>(false);

  const countries = [
    { id: "us", name: "United States" },
    { id: "ca", name: "Canada" },
    { id: "uk", name: "United Kingdom" },
    { id: "au", name: "Australia" },
    { id: "de", name: "Germany" },
    { id: "fr", name: "France" },
    { id: "in", name: "India" },
  ];

  const allResumes = uploadedResumes.map((resume) => ({
    id: resume.name,
    name: resume.name,
  }));

  useEffect(() => {
    setSelectedResume(currentResume?.name || settings.resume);
    setSelectedCountry(
      settings.country && settings.country !== "" ? settings.country : "global"
    );
    setRemoteOnly(true); // Force to true
  }, [settings, currentResume]);

  const saveSettings = () => {
    const selectedResumeData = uploadedResumes.find(
      (resume) => resume.name === selectedResume
    );
    if (selectedResumeData) {
      setCurrentResume(selectedResumeData);
      updateSettings({
        ...settings,
        resume: selectedResumeData.name,
        country: selectedCountry,
        remoteOnly: true, // Always true
      });
    } else {
      updateSettings({
        ...settings,
        country: selectedCountry,
        remoteOnly: true, // Always true
      });
    }

    toast({
      title: "Settings saved",
      description: "Your workspace settings have been updated.",
    });

    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", "123");

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
        setSelectedResume(file.name);
        toast({
          title: "Resume uploaded successfully",
          description: `${file.name} has been uploaded and parsed successfully.`,
        });
      } else {
        throw new Error("Failed to parse resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        variant: "destructive",
        title: "Resume upload failed",
        description:
          "There was an error parsing your resume. Please try again.",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="resume">Selected Resume</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedResume} onValueChange={setSelectedResume}>
              <SelectTrigger id="resume">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {allResumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="flex gap-2 items-center"
            onClick={handleUploadClick}
            disabled={uploadingResume}
          >
            <Upload className="w-4 h-4" />
            {uploadingResume ? "Uploading..." : "Upload"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country">Job Country</Label>
        <Select value="global" disabled>
          <SelectTrigger id="country">
            <SelectValue placeholder="Global" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="remote-only" className="cursor-pointer">
          Remote Jobs Only
        </Label>
        <Switch
          id="remote-only"
          checked={true}
          disabled
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveSettings}>Save Changes</Button>
      </div>
    </div>
  );
};
