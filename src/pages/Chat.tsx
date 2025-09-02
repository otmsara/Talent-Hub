
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import ConversationList from '@/components/chat/ConversationList';
import MessageList from '@/components/chat/MessageList';
import MessageComposer from '@/components/chat/MessageComposer';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { users } from '@/data/dummyData';
import { useAccount } from '@/contexts/AccountContext';
import CustomAvatar from '@/components/ui/CustomAvatar';

const NewChatDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { createNewConversation } = useChat();
  const { currentUser } = useAccount();

  // Filter users excluding current user
  const filteredUsers = users
    .filter(user => user.id !== currentUser?.id)
    .filter(user =>
      searchQuery.trim() === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleUserSelect = (userId: string) => {
    createNewConversation(userId);
    toast.success("New conversation started");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0C112A] border-none">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <CustomAvatar 
                    userId={user.id}
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChatContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const { currentConversation, selectConversation, conversations } = useChat();

  // Mobile view detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track the last selected conversation to avoid auto-selecting after closing
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  // When a conversation is selected, update lastSelected
  React.useEffect(() => {
    if (currentConversation) {
      setLastSelected(currentConversation.id);
    }
  }, [currentConversation]);

  // Prevent auto-reselecting a conversation after closing on mobile
  React.useEffect(() => {
    if (
      isMobile &&
      !currentConversation &&
      lastSelected &&
      conversations.length > 0
    ) {
      // If the last selected conversation is still in the list, do not auto-select it
      // (prevents the glitch)
      // Do nothing
    }
  }, [isMobile, currentConversation, lastSelected, conversations]);

  // Show chat view on mobile only if a conversation is selected
  const showConversation = isMobile ? !!currentConversation : true;

  // Back to conversation list on mobile
  const handleBack = () => {
    selectConversation(null);
    setLastSelected(null);
  };

  return (
    <>
      <div
        className={`flex flex-col md:flex-row flex-1 min-h-0 gap-6 w-full ${
          isMobile ? "overflow-hidden h-full" : "h-[600px] md:h-[700px]"
        }`}
        style={isMobile ? { height: "100dvh", maxHeight: "100dvh" } : {}}
      >
        {/* Conversation List */}
        {(!isMobile || !showConversation) && (
          <div className="w-full md:w-80 border border-border rounded-lg overflow-hidden flex flex-col flex-shrink-0 min-h-0 h-full">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                size="icon"
                className="ml-2 flex-shrink-0 rounded-full bg-cyan-400/30 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] hover:bg-cyan-400/40 transition"
                style={{ textShadow: "0 0 6px #22d3ee" }}
                onClick={() => setIsNewChatOpen(true)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              <ConversationList
                searchQuery={searchQuery}
                onConversationClick={() => {}}
              />
            </div>
          </div>
        )}

        {/* Chat View */}
        {(!isMobile || showConversation) && currentConversation && (
          <div
            className={`flex-1 border border-border rounded-lg flex flex-col min-w-0 min-h-0 ${
              isMobile ? "overflow-hidden" : "overflow-auto"
            }`}
            style={
              isMobile
                ? { height: "100%", maxHeight: "100%", flex: 1 }
                : {}
            }
          >
            {isMobile && (
              <div className="flex items-center p-2 border-b border-border">
                <Button
                  size="icon"
                  variant="ghost"
                  className="mr-2"
                  onClick={handleBack}
                  aria-label="Back to conversation list"
                >
                  <X className="h-5 w-5" />
                </Button>
                <span className="font-medium">Conversation</span>
              </div>
            )}
            <div
              className="flex-1 pb-6"
              style={
                isMobile
                  ? { overflowY: "auto", minHeight: 0, maxHeight: "calc(100dvh - 110px)" }
                  : { overflowY: "auto", minHeight: 0 }
              }
            >
              <MessageList />
            </div>
            <MessageComposer />
          </div>
        )}
      </div>

      <NewChatDialog
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
    </>
  );
};

const Chat = () => {
  // Mobile view detection for outermost container
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="flex flex-1 min-h-0 w-full max-w-5xl mx-auto"
      style={
        isMobile
          ? { height: "100dvh", maxHeight: "100dvh", overflow: "hidden" }
          : { maxHeight: "80vh" }
      }
    >
      <ChatProvider>
        <ChatContainer />
      </ChatProvider>
    </div>
  );
};

export default Chat;
