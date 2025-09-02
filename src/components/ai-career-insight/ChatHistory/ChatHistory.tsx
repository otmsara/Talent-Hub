/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { EllipsisVertical, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AiContext from "../../_context/AiContextProvider";
import { aiDeleteChat, aiRequestChats, aiUpdateChatTitle } from "../actions";
import { ChatsTypes, DataTypes } from "@/types/types";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
  const { chatRightBar, setChatRightBar, tabState, sessionId } =
    useContext(AiContext);
  const [data, setData] = useState<DataTypes | null>(null);
  const [chats, setChats] = useState<ChatsTypes[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isTitleUpdated, setIsTitleUpdated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTitleUpdated) {
      setIsTitleUpdated(false);
    }
  }, [isTitleUpdated]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await aiRequestChats(pageNumber);
        const { success, err, data } = response || {
          success: false,
          data: null,
          err: "Session expired. Please log in again.",
        };
        if (success) {
          setData(data);
          setChats(data.results);
        } else {
          toast({
            variant: "destructive",
            description: err || "Failed to fetch chat history.",
          });
          window.location.reload();
        }
      } catch (error) {
        const err = error as AxiosError;
        toast({
          variant: "destructive",
          description: err.message || "An error occurred. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [tabState, pageNumber, isTitleUpdated, sessionId]);

  const toggleSidebar = () => setChatRightBar((prev) => !prev);

  return (
    <div
      className={cn(
        chatRightBar ? "bg-background border" : "bg-transparent",
        "min-h-[calc(100vh-4.4rem)] rounded-l-lg lg:border absolute p-1 right-0 bottom-0"
      )}
      style={{
        width: chatRightBar ? "360px" : "fit-content",
      }}
    >
      {chatRightBar && (
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 z-50 p-2 rounded-full bg-background hover:bg-accent focus:outline-none"
          aria-label="Close chat history"
        >
          <Icon icon="lucide:x" />
        </button>
      )}
      
      {chatRightBar && (
        <div className="flex flex-col w-full gap-7 pt-10">
          {loading ? (
            <LoadingSkeleton currentPage={pageNumber} />
          ) : chats.length > 0 ? (
            <ChatContent
              chats={chats}
              setChats={setChats}
              currentPage={pageNumber}
              onPageChange={setPageNumber}
              setIsTitleUpdated={setIsTitleUpdated}
            />
          ) : (
            <p className="mt-10">No chats available.</p>
          )}

          <ChatPagination
            loading={loading}
            data={data}
            currentPage={pageNumber}
            onPageChange={setPageNumber}
          />
        </div>
      )}
    </div>
  );
};

const ChatContent = ({
  chats,
  setChats,
  currentPage,
  setIsTitleUpdated,
  onPageChange,
}: {
  chats: ChatsTypes[];
  setChats: Dispatch<SetStateAction<ChatsTypes[]>>;
  currentPage: number;
  setIsTitleUpdated: Dispatch<SetStateAction<boolean>>;
  onPageChange: Dispatch<SetStateAction<number>>;
}) => {
  const { height } = useWindowDimensions();
  const [newTitle, setNewTitle] = useState("");
  const [convToEdit, setConvToEdit] = useState<ChatsTypes | undefined>(undefined);
  const [convToDelete, setConvToDelete] = useState<ChatsTypes | undefined>(undefined);
  const [isOpenDeletDialog, setIsOpenDeletDialog] = useState(false);

  return (
    <div className="pl-1">
      <h2 className="text-lg font-bold mb-4 sm:text-base">
        Recent Conversations
        <br />
        <p className="text-sm text-gray-400">page - {currentPage}</p>
      </h2>
      <motion.ul
        data-testid="chat-list"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className={`${height <= 700 ? "h-[400px]" : ""} space-y-3 overflow-y-scroll`}
      >
        {chats.map((chat, index) => (
          <ChatList
            key={chat.id || `chat-${index}`}
            chat={chat}
            setConvToDelete={setConvToDelete}
            setConvToEdit={setConvToEdit}
            setIsOpenDeletDialog={setIsOpenDeletDialog}
          />
        ))}
      </motion.ul>
      <UpdateTitleDialoge
        convToEdit={convToEdit}
        setConvToEdit={setConvToEdit}
        setNewTitle={setNewTitle}
        setIsTitleUpdated={setIsTitleUpdated}
        newTitle={newTitle}
      />
      <DeleteDialoge
        currentPage={currentPage}
        onPageChange={onPageChange}
        setChats={setChats}
        isOpenDeletDialog={isOpenDeletDialog}
        setIsOpenDeletDialog={setIsOpenDeletDialog}
        convToDelete={convToDelete}
        setConvToDelete={setConvToDelete}
      />
    </div>
  );
};

const ChatList = ({
  chat,
  setConvToEdit,
  setConvToDelete,
  setIsOpenDeletDialog,
}: {
  chat: ChatsTypes;
  setConvToEdit: Dispatch<SetStateAction<ChatsTypes | undefined>>;
  setConvToDelete: Dispatch<SetStateAction<ChatsTypes | undefined>>;
  setIsOpenDeletDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setSessionId, sessionId, setChatRightBar } = useContext(AiContext);

  return (
    <motion.li
      key={chat.id}
      className={cn(
        "border rounded-full p-2 flex items-center gap-2 hover:bg-blue-800 hover:text-white justify-between",
        { "bg-blue-800 text-white": sessionId === chat.id }
      )}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div
        onClick={() => {
          setSessionId(chat.id);
          setChatRightBar(false);
        }}
        className="flex gap-2 items-center cursor-pointer"
      >
        <MessageSquare size={23} />
        <p className="text-sm font-semibold truncate overflow-hidden w-[250px]">
          {chat.title}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical
            size={25}
            className="py-1 rounded-full w-7 h-7 text-foreground bg-background hover:bg-muted/70"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setConvToEdit(chat)} asChild>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:pencil" className="text-blue-500" />
              <span>Rename</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setConvToDelete(chat);
              setIsOpenDeletDialog(true);
            }}
            className="flex items-center gap-3"
          >
            <Icon icon="lucide:trash" className="text-red-500" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.li>
  );
};

const UpdateTitleDialoge = ({
  convToEdit,
  setConvToEdit,
  setNewTitle,
  newTitle,
  setIsTitleUpdated,
}: {
  convToEdit: ChatsTypes | undefined;
  newTitle: string;
  setConvToEdit: Dispatch<SetStateAction<ChatsTypes | undefined>>;
  setNewTitle: Dispatch<SetStateAction<string>>;
  setIsTitleUpdated: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  const handleTitleUpdate = async (id: string, title: string) => {
    const response = await aiUpdateChatTitle(id, title);
    const { success, err } = response || {
      success: false,
      err: "Session expired. Please log in again.",
    };
    if (success) {
      toast({ variant: "default", description: "Title updated successfully" });
      setConvToEdit(undefined);
      setIsTitleUpdated(true);
    } else {
      toast({
        variant: "destructive",
        description: err || "Error updating title",
      });
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={convToEdit !== undefined}
      onOpenChange={() => setConvToEdit(undefined)}
    >
      <DialogContent>
        {convToEdit !== undefined && (
          <>
            <DialogHeader>
              <DialogTitle>Edit conversation title</DialogTitle>
              <DialogDescription>
                Change the title of the conversation titled
                <strong> &apos;{convToEdit.title}&apos;</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-center gap-4">
              <Input
                name="title"
                defaultValue={convToEdit.title}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="ms-auto flex w-max gap-2">
                <Button
                  onClick={() => handleTitleUpdate(convToEdit.id, newTitle)}
                  className="text-white"
                  type="submit"
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setConvToEdit(undefined)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialoge = ({
  setChats,
  convToDelete,
  setConvToDelete,
  isOpenDeletDialog,
  setIsOpenDeletDialog,
  currentPage,
  onPageChange,
}: {
  setChats: Dispatch<SetStateAction<ChatsTypes[]>>;
  convToDelete: ChatsTypes | undefined;
  setConvToDelete: Dispatch<SetStateAction<ChatsTypes | undefined>>;
  setIsOpenDeletDialog: Dispatch<SetStateAction<boolean>>;
  isOpenDeletDialog: boolean;
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}) => {
  const { toast } = useToast();

  const handleDeleteSession = async (id: string) => {
    const response = await aiDeleteChat(id);
    const { success, err } = response || {
      success: false,
      err: "Session expired. Please log in again.",
    };
    if (success) {
      toast({ variant: "default", description: "Chat deleted successfully" });
      setConvToDelete(undefined);
      setIsOpenDeletDialog(false);

      setChats((prev) => {
        const updatedChats = prev.filter((item: ChatsTypes) => item.id !== id);
        if (updatedChats.length === 0 && currentPage > 1) {
          onPageChange(currentPage - 1);
        }
        return updatedChats;
      });
    } else {
      toast({
        variant: "destructive",
        description: err || "Failed to delete chat",
      });
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={isOpenDeletDialog && convToDelete !== undefined}
      onOpenChange={() => {
        setConvToDelete(undefined);
        setIsOpenDeletDialog(false);
      }}
    >
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              All chat history will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center">
              Are you sure you want to delete the conversation titled <br />
              {<strong> &apos;{convToDelete?.title || ""}&apos;</strong>}
            </p>
            <div className="flex gap-2">
              {convToDelete?.id ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSession(convToDelete?.id)}
                  >
                    Proceed
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsOpenDeletDialog(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setIsOpenDeletDialog(false)}
                >
                  No id please try again
                </Button>
              )}
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

const ChatPagination = ({
  data,
  currentPage,
  onPageChange,
  loading,
}: {
  data: DataTypes | null;
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  loading: boolean;
}) => {
  if (!data) return null;

  const handlePageChange = (page: number) => onPageChange(page);

  return (
    <Pagination className={cn("")}>
      <PaginationContent>
        {data.previous && (
          <PaginationItem>
            {!loading && (
              <PaginationPrevious
                aria-disabled={loading}
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous Page"
              />
            )}
          </PaginationItem>
        )}

        {data.next && (
          <PaginationItem>
            {!loading && (
              <PaginationNext
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next Page"
              />
            )}
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

const LoadingSkeleton = ({ currentPage }: { currentPage: number }) => (
  <div className="space-y-2 pl-1">
    <h2 className="text-lg font-bold mb-4 sm:text-base">
      Recent Conversations
      <br />
      <p className="text-sm text-gray-400">page - {currentPage}</p>
    </h2>
    {[...Array(11)].map((_, i) => (
      <Skeleton
        key={i}
        data-testid="loading-skelton"
        className="h-[45px] w-full rounded-full"
      />
    ))}
  </div>
);

export default ChatHistory;