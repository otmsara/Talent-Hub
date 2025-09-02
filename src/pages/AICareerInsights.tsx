// components/ai-career-insight/UploadLogic.tsx
import React, {
  useState,
  useContext,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIheader from "@/components/ai-career-insight/AIheader";
import { Messages } from "@/types/types";
import AiContext from "@/components/_context/AiContextProvider";
import { Brain, FileText, TrendingUp } from "lucide-react";
import { PromptInput } from "@/components/ai-career-insight/PromptInput";
import { ChatMessages } from "@/components/ai-career-insight/ChatMessages";
import { aiRequestChatById, aiRequestChats } from "@/components/ai-career-insight/actions";
import { useToast } from "@/hooks/use-toast";
import ChatHistory from "@/components/ai-career-insight/ChatHistory/ChatHistory";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";


export default function UploadLogic({ token }: { token?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [fetchLastSessionID, setFetchLastSessionId] = useState(false);
  const chatParent = useRef<HTMLUListElement>(null);
  const [searchParams] = useSearchParams();
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
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.currentTarget.files) return;
    const selectedFile = e.currentTarget.files[0];
    setFile(selectedFile);
    if ((!userInput || userInput.trim() === "") && selectedFile) {
      setUserInput(selectedFile.name);
    }
  };

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
          window.location.reload();
        } finally {
          setIsSending(false);
        }
      };
      fetchLastSessionId();
    }
  }, [fetchLastSessionID]);

  useEffect(() => {
    const getChat = async () => {
      if (!sessionId) return;

      const response = await aiRequestChatById(sessionId);

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
          .flat();

        setMessages(formattedMessages);
      } else {
        toast({
          variant: "destructive",
          description:
            err || `Failed to fetch session ${sessionId} . Please try again.`,
        });
        window.location.reload();
      }
    };
    getChat();
  }, [sessionId]);

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
    formData.append("user_input", userInput);
    if (file) {
      formData.append("file", file);
    }
  
    setUserInput("");
    setFile(null);
  
    try {
      // Construct the URL properly
      let url = `${API_BASE_URL}/ai/chat/`;
      if (sessionId) {
        url += `${sessionId}/`;
      }
  
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
  
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
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
      {workspace !== "career" && !chatRightBar && (
        <Button
          onClick={() => setChatRightBar(true)}
          variant="ghost"
          className="fixed right-4 top-8 z-50 md:right-8"
          aria-label="Show Chat History"
        >
          <Icon icon="lucide:menu" />
        </Button>
      )}

      {/* Main content area wrapper with consistent horizontal padding */}
      <div className={`flex-1 flex flex-col px-4`}> {/* Added px-4 here */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <AIheader messages={messages} setMessages={setMessages} />

          {messages.length > 0 ? (
            <div
              className="overflow-y-auto pt-0" // Removed px-4 from here, parent handles it
              ref={chatParent}
              style={{ scrollbarGutter: "stable" }}
            >
              <ChatMessages messages={messages} />
            </div>
          ) : (
            // Adjusted padding-bottom to `pb-0` and added `mb-0` to `ChatFeatures`
            <div className="flex-1 pb-0 mb-0">
              <ChatFeatures />
            </div>
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
    // MODIFIED: Removed horizontal padding (px-4 sm:px-6) as parent will handle it.
    // Also, added mb-0 to ensure no extra margin pushes PromptInput down.
    <section className="mb-0 flex justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer">
            <div className="p-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-gray-100 mb-0.5">
                Resume Building Tips
              </h3>
              <p className="text-xs text-gray-400 leading-tight">
                Craft a standout resume that gets noticed.
              </p>
            </div>
          </div>

          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md hover:shadow-lg hover:border-purple-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer">
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

          <div className="bg-transparent rounded-xl border-2 border-gray-600 shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 cursor-pointer">
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