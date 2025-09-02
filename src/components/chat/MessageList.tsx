
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { findUserById } from '@/data/dummyData';
import { formatRelativeTime } from '@/data/dummyData';
import { useAccount } from '@/contexts/AccountContext';
import CustomAvatar from '@/components/ui/CustomAvatar';
import { cn } from '@/lib/utils';
import VoiceNotePlayer from '../ui/VoiceNotePlayer';

const MessageList: React.FC = () => {
  const { messages, currentConversation } = useChat();
  const { currentUser } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only scroll to bottom if a new message is added by the current user
  const prevMessagesRef = useRef(messages);
  useEffect(() => {
    if (!currentUser) return;
    const prevMessages = prevMessagesRef.current;
    if (
      prevMessages.length < messages.length &&
      messages[messages.length - 1]?.senderId === currentUser.id
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesRef.current = messages;
  }, [messages, currentUser]);

  if (!currentConversation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No user selected.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: typeof messages } = {};
  messages.forEach(message => {
    const date = message.timestamp.toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const dateGroups = Object.entries(groupedMessages);

  // Helper to format date as "Saturday - June 14th, 2025"
  function formatChatDate(date: Date) {
    const dayOfWeek = date.toLocaleDateString(undefined, { weekday: 'long' });
    const month = date.toLocaleDateString(undefined, { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    // Ordinal suffix
    function getOrdinal(n: number) {
      if (n > 3 && n < 21) return n + 'th';
      switch (n % 10) {
        case 1: return n + 'st';
        case 2: return n + 'nd';
        case 3: return n + 'rd';
        default: return n + 'th';
      }
    }
    return `${dayOfWeek} - ${month} ${getOrdinal(day)}, ${year}`;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {dateGroups.map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <span className="text-xs text-white/60">
              {formatChatDate(dateMessages[0].timestamp)}
            </span>
          </div>
          
          {dateMessages.map(message => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = findUserById(message.senderId);

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2 max-w-[80%]",
                  isCurrentUser ? "self-end ml-auto flex-row-reverse" : "self-start mr-auto"
                )}
              >
                <CustomAvatar
                  userId={sender.id}
                  src={sender.avatar}
                  alt={sender.name}
                  size="sm"
                  className="mb-1"
                />

                <div className="space-y-1">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 break-words",
                      message.audioUrl
                        ? "bg-transparent p-0"
                        : isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-white text-[#0B1222] rounded-bl-none"
                    )}
                  >
                    {message.audioUrl ? (
                      <VoiceNotePlayer audioUrl={message.audioUrl} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs text-muted-foreground",
                    isCurrentUser ? "text-right" : "text-left"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
