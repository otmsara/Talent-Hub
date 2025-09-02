"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type ParsedResume = {
  name: string; // Resume name
  data: any; // Parsed resume data
  file: {
    name: string;
    type: string;
    content: string; // Base64 content of the file
  }; // Resume file in a structured format
};

type ResumeContextType = {
  uploadedResumes: ParsedResume[]; // List of uploaded resumes
  setUploadedResumes: (resumes: ParsedResume[]) => void;
  currentResume: ParsedResume | null; // Currently selected resume
  setCurrentResume: (resume: ParsedResume | null) => void;
  addResume: (file: File, parsedData: any) => Promise<void>;
  getResumeFile: (resume: ParsedResume) => FormData;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const safeParseJSON = (key: string, fallback: any) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error(
        `Error parsing JSON from localStorage for key "${key}":`,
        error
      );
      return fallback;
    }
  };

  const saveToLocalStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage for key "${key}":`, error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const [uploadedResumes, setUploadedResumes] = useState<ParsedResume[]>([]);
  const [currentResume, setCurrentResume] = useState<ParsedResume | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUploadedResumes(safeParseJSON("resumes", []));
      setCurrentResume(safeParseJSON("currentResume", null));
    }
  }, []);

  const addResume = async (file: File, parsedData: any) => {
    const base64Content = await fileToBase64(file);

    const newResume: ParsedResume = {
      name: file.name,
      data: parsedData,
      file: {
        name: file.name,
        type: file.type,
        content: base64Content,
      },
    };

    const updatedResumes = [...uploadedResumes, newResume];
    setUploadedResumes(updatedResumes);
    setCurrentResume(newResume);
    saveToLocalStorage("resumes", updatedResumes);
    saveToLocalStorage("currentResume", newResume);
  };

  const getResumeFile = (resume: ParsedResume) => {
    const formData = new FormData();
    formData.append("name", resume.file.name);
    formData.append("type", resume.file.type);
    formData.append("content", resume.file.content);
    return formData;
  };

  return (
    <ResumeContext.Provider
      value={{
        uploadedResumes,
        setUploadedResumes,
        currentResume,
        setCurrentResume,
        addResume,
        getResumeFile,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
