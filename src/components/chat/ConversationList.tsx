
import React from 'react';
import { useChat, Conversation } from '@/contexts/ChatContext';
import { findUserById } from '@/data/dummyData';
import { formatRelativeTime } from '@/data/dummyData';
import { useAccount } from '@/contexts/AccountContext';
import CustomAvatar from '@/components/ui/CustomAvatar';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  searchQuery?: string;
  onConversationClick?: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ searchQuery = '', onConversationClick }) => {
  const { conversations, selectConversation, currentConversation } = useChat();
  const { currentUser } = useAccount();

  const formatMessagePreview = (text: string) => {
    return text.length > 30 ? `${text.substring(0, 30)}...` : text;
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery.trim()) return true;

    if (!currentUser) return false;
    const otherUserId = conversation.participants.find(id => id !== currentUser.id);
    if (!otherUserId) return false;

    const otherUser = findUserById(otherUserId);
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (conversation.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  if (filteredConversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {searchQuery ? "No conversations match your search" : "No conversations yet"}
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {filteredConversations.map((conversation) => {
        if (!currentUser) return null;
        const otherUserId = conversation.participants.find(id => id !== currentUser.id);
        const otherUser = otherUserId ? findUserById(otherUserId) : null;
        const lastMessage = conversation.lastMessage;

        if (!otherUser) return null;

        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-start p-4 gap-3 border-b border-border/30 cursor-pointer hover:bg-accent/10 transition-colors",
              currentConversation?.id === conversation.id && "bg-accent/20"
            )}
            onClick={() => {
              selectConversation(conversation.id);
              if (typeof onConversationClick === "function") onConversationClick();
            }}
          >
            <CustomAvatar 
              userId={otherUser.id}
              src={otherUser.avatar}
              alt={otherUser.name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground truncate">{otherUser.name}</h3>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(lastMessage.timestamp)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                {lastMessage ? (
                  <p className={cn(
                    "text-sm truncate",
                    lastMessage.read || lastMessage.senderId === currentUser.id 
                      ? "text-muted-foreground" 
                      : "text-foreground font-medium"
                  )}>
                    {lastMessage.senderId === currentUser.id ? "You: " : ""}
                    {formatMessagePreview(lastMessage.text)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Start a conversation</p>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
