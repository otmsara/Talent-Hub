/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useState,
  useContext,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import AIheader from "./AIheader";
import { Messages } from "@/types/types";
import AiContext from "../_context/AiContextProvider";
import { Brain, FileText, TrendingUp } from "lucide-react";
import { PromptInput } from "./PromptInput"; // Corrected import
import { ChatMessages } from "./ChatMessages";
import { aiRequestChatById, aiRequestChats } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ChatHistory from "./ChatHistory/ChatHistory";
import { Button } from "@/components/ui/button";
import Icon from "../Icon";

export default function UploadLogic({ token }: { token?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  // console.log(messages);
  const [isSending, setIsSending] = useState(false);
  const [fetchLastSessionID, setFetchLastSessionId] = useState(false);
  const chatParent = useRef<HTMLUListElement>(null);
  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");
  const InputFileRef = useRef<HTMLInputElement | null>(null);
  const {
    tabState,
    setTabState,
    setUploadSucces,
    sessionId,
    setSessionId,
    chatRightBar,
    setChatRightBar,
  } = useContext(AiContext);
  const { toast } = useToast();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  // console.log(userInput);
  // console.log(file?.name);
  //file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.currentTarget.files) return;
    const selectedFile = e.currentTarget.files[0];
    setFile(selectedFile);
    if ((!userInput || userInput.trim() === "") && selectedFile) {
      setUserInput(selectedFile.name); // Set file name as input if input is empty
    }
  };
  // fetch last session id
  useEffect(() => {
    if (!sessionId && fetchLastSessionID) {
      const fetchLastSessionId = async () => {
        setIsSending(true);
        try {
          const response = await aiRequestChats(1);
          const { success, data, err } = response || {
            success: false,
            data: null,
            err: "Session expired. Please log in again.",
          };
          if (success) {
            setSessionId(data.results[0].id);
          } else {
            toast({
              variant: "destructive",
              description: err || `Failed to fetch chats.`,
            });
          }
        } catch (error) {
          console.error(error);
          router.refresh();
        } finally {
          setIsSending(false);
        }
      };
      fetchLastSessionId();
    }
  }, [fetchLastSessionID]);
  // fetch conversation by id
  useEffect(() => {
    const getChat = async () => {
      if (!sessionId) return;

      const response = await aiRequestChatById(sessionId);

      // Ensure response is always destructured from a valid object
      const { success, data, err } = response || {
        success: false,
        data: null,
        err: "Session expired. Please log in again.",
      };
      if (success) {
        const formattedMessages = data.results
          .map((chat: { input: string; response: string }) => [
            {
              role: "user",
              content: chat.input,
            },
            {
              role: "assistant",
              content: chat.response,
            },
          ])
          .flat(); // Flatten the array to make it a single list of messages

        setMessages(formattedMessages);
      } else {
        toast({
          variant: "destructive",
          description:
            err || `Failed to fetch session ${sessionId} . Please try again.`,
        });
        router.refresh();
      }
    };
    getChat();
  }, [sessionId]);

  // submit funciton
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userInput.trim() === "" && !file) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
      { role: "assistant", content: "", loading: true },
    ]);
    setTabState(true);
    setIsSending(true);
    setUploadSucces(false);

    const formData = new FormData();
    formData.append("user_input", userInput); // Use the local variable here
    if (file) {
      formData.append("file", file);
    }
    // console.log(userInput, file);
    setUserInput("");
    setFile(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/chat/${sessionId ? sessionId + "/" : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: formData, // Use the FormData object
        }
      );
      if (!response.body) throw new Error("No response body");
      if (!sessionId) {
        setFetchLastSessionId(true);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the received chunk
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk; // Add each letter to the response
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: aiContent,
            loading: false,
          };
          return updatedMessages;
        });
      }
      // Mark the message as fully loaded
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].loading = false;
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast({
        variant: "destructive",
        description: "Error fetching AI response!!",
      });
    } finally {
      setIsSending(false);
      setUploadSucces(true);
      setFetchLastSessionId(false);
      if (InputFileRef.current) {
        InputFileRef.current.value = "";
        // Reset file input in the DOM
      }
    }
  };

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      requestAnimationFrame(() => {
        domNode.scrollTop = domNode.scrollHeight;
      });
    }
  }, [messages]);
  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Toggle button: only show if not in career workspace and sidebar is closed */}
      {workspace !== "career" && !chatRightBar && (
        <Button
          onClick={() => setChatRightBar(true)}
          variant="ghost"
          className="fixed right-4 top-20 z-50 md:right-8"
          aria-label="Show Chat History"
        >
          <Icon icon="lucide:menu" />
        </Button>
      )}

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col`}>
        <div className="flex justify-center items-center flex-col flex-grow w-full h-full relative">
        <div className={`flex flex-col justify-between items-center w-full flex-grow ${
            tabState ? "" : "min-h-[calc(100vh-7.2rem)]"
            }`}

          >
            <AIheader messages={messages} setMessages={setMessages} />
            {messages.length > 0 ? (
              <ChatMessages messages={messages} ref={chatParent} />
            ) : (
              <ChatFeatures />
            )}
            <PromptInput
              ref={InputFileRef}
              isSending={isSending}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              userInput={userInput}
              setUserInput={setUserInput}
              file={file}
              setFile={setFile}
            />
          </div>
        </div>
      </div>

      {/* Responsive ChatHistory sidebar */}
      {chatRightBar && workspace !== "career" && (
        <div
          className="
            fixed md:static top-0 right-0 z-50
            w-full md:w-[350px] h-full
            bg-background shadow-lg
            transition-all
          "
          style={{ maxWidth: 400 }}
        >
          <ChatHistory />
        </div>
      )}
    </div>
  );
}

const ChatFeatures = () => {
  return (
    // Section for the feature cards.
    // py-4 for reduced vertical padding, px-4 for horizontal.
    // mb-4 for margin below the section, creating a small gap to the next element.
    // flex justify-center to horizontally center the content.
    <section className="py-2 px-4 sm:px-6 mb-1 flex justify-center">
      {/* Container for the grid, setting a max-width and centering it. */}
      <div className="max-w-3xl w-full mx-auto">
        {/* Grid layout for the cards. gap-4 provides good spacing. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Card 1:  */}
          {/* Enhanced Border Styling:
              - border-2: Makes the border slightly thicker for a more "solid" feel.
              - border-gray-600: A slightly lighter gray for more visibility against the dark background.
              - hover:border-blue-500: Changes the border color to a vibrant blue on hover,
                matching the icon color for visual coherence and a "nice view."
              - shadow-md & hover:shadow-lg: Subtle depth.
              - transition: Smooth animation for all changes.
              - transform hover:-translate-y-0.5: Gentle lift on hover.
              - cursor-pointer: Indicates interactivity. */}
          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md
                          hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out
                          transform hover:-translate-y-0.5 cursor-pointer">
            {/* Inner padding for content within the card, kept compact. */}
            <div className="p-3">
              {/* Icon container: kept compact. */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white mb-1">
                <FileText className="w-4 h-4" />
              </div>
              {/* Title: kept compact. */}
              <h3 className="text-base font-semibold text-gray-100 mb-0.5">
                
              </h3>
              {/* Description: kept compact. */}
              <p className="text-xs text-gray-400 leading-tight">
                Craft a standout resume that gets noticed.
              </p>
            </div>
          </div>

          {/* Card 2: Arya AI: Career Insights - Apply consistent border enhancements */}
          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md
                          hover:shadow-lg hover:border-purple-500 transition-all duration-300 ease-in-out
                          transform hover:-translate-y-0.5 cursor-pointer">
            <div className="p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-700 text-white mb-1">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-gray-100 mb-0.5">
                Arya AI: Career Insights
              </h3>
              <p className="text-xs text-gray-400 leading-tight">
                Leverage AI for personalized career paths.
              </p>
            </div>
          </div>

          {/* Card 3: Trending Job Skills - Apply consistent border enhancements */}
          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md
                          hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out
                          transform hover:-translate-y-0.5 cursor-pointer">
            <div className="p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-gray-100 mb-0.5">
                Trending Job Skills
              </h3>
              <p className="text-xs text-gray-400 leading-tight">
                Stay competitive with in-demand skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
