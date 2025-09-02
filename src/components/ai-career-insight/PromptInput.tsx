// components/ai-career-insight/PromptInput.tsx
"use client";

import {
  ChevronLeft,
  ChevronRight,
  File as LucideFile,
  LucideIcon,
  Paperclip,
  Send,
  Trash2,
} from "lucide-react";
import {
  Dispatch,
  FormEvent,
  forwardRef,
  SetStateAction,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import AiContext from "../_context/AiContextProvider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icon as Ify } from "@iconify/react";
import { categorizedPrompts } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PromptTypes {
  file: File | null;
  isSending: boolean;
  setFile: Dispatch<SetStateAction<File | null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
}

export const PromptInput = forwardRef<HTMLInputElement, PromptTypes>(
  (
    {
      file,
      setFile,
      handleSubmit,
      userInput,
      isSending,
      setUserInput,
      handleFileChange,
    },
    ref
  ) => {
    const { chatRightBar } = useContext(AiContext);

    const handleFileDelete = () => {
      setFile(null);
      if (typeof ref === "function") {
        ref(null);
      } else if (ref && "current" in ref && ref.current) {
        ref.current.value = "";
      }
      if (userInput === file?.name) {
        setUserInput("");
      }
    };

    const changeFileSize = (size: number) => {
      return size < 1_000_000
        ? `${Math.floor(size / 1_000)}KB`
        : `${Math.floor(size / 1_000_000)}MB`;
    };

    return (
      // MODIFIED: Simplified outer div. Removed `max-w-4xl mx-auto`.
      // The parent in UploadLogic.tsx should handle `px-4` for overall content width.
      <div className={`sticky ${chatRightBar ? "z-0" : "z-30"} bottom-0 w-full`}>
        <div className="flex justify-center items-center gap-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-[#0c112a] p-4 border border-gray-700 w-full"
          >
            {file && (
              // MODIFIED: Add `md:w-[300px]` to make file display smaller on larger screens
              // while `max-w-full` ensures it respects parent width on small screens.
              // Adjusted `right-0` for better responsiveness if parent is `relative`.
              <div className="flex gap-2 absolute p-2 -top-[85px] right-0 border rounded-lg max-w-full h-[80px] md:w-[300px] sm:right-4">
                <div className="grid gap-2 grid-cols-[30px,1fr] p-2 bg-secondary rounded-lg mr-2 relative min-w-[9rem]">
                  <div
                    onClick={handleFileDelete}
                    className="absolute bottom-0 right-0 p-2 hover:text-red-500 cursor-pointer transition-colors duration-200"
                  >
                    <Trash2 size={15} />
                  </div>
                  <LucideFile size={30} />
                  <div className="truncate">
                    <p className="truncate">{file.name}</p>
                    <small>{changeFileSize(file.size)}</small>
                  </div>
                </div>
              </div>
            )}

            <Textarea
              ref={(el) => {
                if (el && userInput === "") el.style.height = "auto";
              }}
              value={userInput === file?.name ? "" : userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message AI Agent..."
              disabled={isSending}
              className="h-auto max-h-[200px] md:!pt-[1rem] min-h-[44px] rounded-lg border-none md:px-4 text-base resize-none overflow-y-auto focus:placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder-gray-400"
            />

            <Label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center rounded-full p-[9px] relative`}
              style={{
                backgroundColor: isSending ? "rgba(92, 225, 230, 0.5)" : "rgb(76,201,240)",
                cursor: isSending ? "default" : "pointer"
              }}
            >
              <div className="text-background flex flex-col items-center">
                <Paperclip size={20} />
              </div>
              <input
                ref={ref}
                id="dropzone-file"
                accept=".pdf"
                type="file"
                disabled={isSending}
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>

            <Button
              size="icon"
              type="submit"
              className="rounded-full p-[10px]"
              disabled={isSending || (!userInput.trim() && !file)}
              style={{ backgroundColor: "rgb(76,201,240)" }}
            >
              <Send />
            </Button>
          </form>

          {/* PromptDropDown moved inside a relative container to better control its absolute position */}
          <div className="relative">
            <PromptDropDown
              userInput={userInput}
              setUserInput={setUserInput}
              categorizedPrompts={categorizedPrompts}
            />
          </div>
        </div>

        <p className="mt-1 text-center text-xs text-muted-foreground">
          Arya α1 can make mistakes. Check for important information.
        </p>
      </div>
    );
  }
);

interface CategorizedPrompts {
  id: number;
  category: string;
  prompts: string[];
  icon: LucideIcon;
}

export default function PromptDropDown({
  categorizedPrompts,
  setUserInput,
  userInput,
}: {
  categorizedPrompts: CategorizedPrompts[];
  setUserInput: Dispatch<SetStateAction<string>>;
  userInput: string;
}) {
  const [openCatalog, setOpenCatalog] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(0);
  const scrollArea = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right", stepSize: number = 1) => {
    const scrollRef = scrollArea.current;
    if (!scrollRef) return;
    const childWidth = scrollRef.firstElementChild?.clientWidth || 0;
    const scrollAmount = childWidth * stepSize;
    scrollRef.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenCatalog(false);
      }
    }
    if (openCatalog) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCatalog]);

  return (
    // MODIFIED: Removed `self-end` as its parent is now `relative`.
    // The parent div (`<div className="relative">`) in PromptInput.tsx ensures correct positioning.
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpenCatalog((prev) => !prev)}
        className={cn(
          openCatalog ? "bg-foreground text-background" : "",
          "rounded-2xl p-[15px] border-2"
        )}
      >
        <Ify icon="fluent:prompt-48-regular" width="30" height="30" />
      </button>

      {openCatalog && (
        // MODIFIED: Re-calibrated positioning and width for responsiveness.
        // `right-0` places it relative to its new `relative` parent.
        // `max-w-full` prevents overflow. `md:max-w-[700px]` for larger screens.
        // `-translate-y-[27rem]` seems fine for vertical.
        <div
          className={cn(
            "overflow-hidden max-w-full w-fit bg-background p-4 h-[350px] absolute -translate-y-[27rem] right-0 rounded-3xl border-2",
            "md:max-w-[700px]" // Use max-w for responsiveness
          )}
        >
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 h-full px-1 bg-background z-10 outline-none"
            >
              <ChevronLeft />
            </button>

            <div
              ref={scrollArea}
              className="flex overflow-x-scroll p-2 gap-2 no-scrollbar relative px-8"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {categorizedPrompts.map((prompt, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedCatalog(prompt.id)}
                  className={cn(
                    selectedCatalog === prompt.id
                      ? "bg-primary text-white"
                      : "",
                    "cursor-pointer flex gap-2 justify-center items-center text-nowrap p-2 border-2 rounded-3xl font-semibold text-sm select-none"
                  )}
                  style={{ scrollSnapAlign: "center" }}
                >
                  <prompt.icon size={15} /> {prompt.category}
                </span>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 h-full px-1 bg-background outline-none"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Prompts List */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5 max-h-[230px] overflow-auto no-scrollbar">
            {categorizedPrompts
              .filter(({ id }) => id === selectedCatalog)
              .map(({ prompts }) =>
                prompts.map((prompt, i) => (
                  <p
                    key={i}
                    onClick={() => setUserInput(prompt)}
                    className={cn(
                      userInput.trim() === prompt ? "bg-muted" : "",
                      // MODIFIED: Adjusted width to `w-full` for grid items within the dropdown.
                      // The `max-w-[200px]` can be applied conditionally or removed if `w-full` within the grid columns is sufficient.
                      "hover:bg-muted cursor-pointer w-full h-[150px] overflow-hidden border-2 p-2 rounded-xl text-sm"
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setUserInput(prompt);
                      }
                    }}
                  >
                    {prompt}
                  </p>
                ))
              )}
          </div>
        </div>
      )}
    </div>
  );
}
PromptInput.displayName = "PromptInput";