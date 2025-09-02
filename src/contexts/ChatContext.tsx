import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, users } from '@/data/dummyData';
import { useAccount } from '@/contexts/AccountContext';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  audioUrl?: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  selectConversation: (conversationId: string) => void;
  sendMessage: (text: string, audioUrl?: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  createNewConversation: (userId: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const generateDummyMessages = (currentUserId: string): Message[] => {
  const dummyMessages: Message[] = [];

  // Only use users that are NOT the current user
  users.filter(user => user.id !== currentUserId).forEach((user, userIndex) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);

    const messageCount = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < messageCount; i++) {
      // Alternate sender for more realistic demo: even index = current user, odd = other user
      const isFromCurrentUser = i % 2 === 0;
      const hours = Math.floor(Math.random() * 48);
      const timestamp = new Date(startDate);
      timestamp.setHours(timestamp.getHours() + hours);

      dummyMessages.push({
        id: `msg_${userIndex}_${i}_${currentUserId}`,
        senderId: isFromCurrentUser ? currentUserId : user.id,
        receiverId: isFromCurrentUser ? user.id : currentUserId,
        text: getRandomMessage(isFromCurrentUser, i),
        timestamp,
        read: isFromCurrentUser || hours > 24
      });
    }
  });

  return dummyMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Helper to get random message text
const getRandomMessage = (isFromCurrentUser: boolean, index: number): string => {
  const currentUserMessages = [
    "Hey, how's it going?",
    "Did you see that new design?",
    "I'm working on a new project, would love your input!",
    "Can we chat about the collaboration idea?",
    "Just wanted to check in about the meeting tomorrow.",
    "I sent you the files you requested.",
    "Let me know what you think about the proposal.",
    "Are you available for a quick call later?",
    "Thanks for your help earlier!",
    "Have you had a chance to look at my message?"
  ];
  
  const otherUserMessages = [
    "Doing great, how about you?",
    "Yes, it looks amazing!",
    "I'd be happy to provide some feedback.",
    "I'm interested in the collaboration, tell me more.",
    "I'll be there, thanks for the reminder.",
    "Got them, thanks!",
    "The proposal looks good to me.",
    "Sure, I'm free around 3pm.",
    "No problem at all!",
    "I'll check it out right now."
  ];
  
  // Use index if within range, otherwise pick random
  const messageArray = isFromCurrentUser ? currentUserMessages : otherUserMessages;
  const messageIndex = index < messageArray.length ? index : Math.floor(Math.random() * messageArray.length);
  
  return messageArray[messageIndex];
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAccount();

  // When user changes, reset messages and conversations
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  // Re-initialize messages and conversations when user changes
  useEffect(() => {
    if (!currentUser) return;
    // Clear any previous chat data for other users
    Object.keys(localStorage)
      .filter(key => key.startsWith("chat_conversations_") || key.startsWith("chat_allMessages_"))
      .forEach(key => localStorage.removeItem(key));
    setAllMessages(generateDummyMessages(currentUser.id));
    // Generate conversations for this user only
    const convs: Conversation[] = users
      .filter(u => u.id !== currentUser.id)
      .map(u => ({
        id: `conv_${[currentUser.id, u.id].sort().join('_')}`,
        participants: [currentUser.id, u.id].sort(),
        lastMessage: null,
        unreadCount: 0
      }));
    setConversations(convs);
    setCurrentConversationId(null);
    setCurrentMessages([]);
  }, [currentUser]);

  // Persist conversations and messages to localStorage (optional: per user)
  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`chat_conversations_${currentUser.id}`, JSON.stringify(conversations));
  }, [conversations, currentUser]);
  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`chat_allMessages_${currentUser.id}`, JSON.stringify(allMessages));
  }, [allMessages, currentUser]);

  // Update current messages when conversation changes
  useEffect(() => {
    if (!currentConversationId) {
      setCurrentMessages([]);
      return;
    }
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) {
      setCurrentMessages([]);
      return;
    }
    
    // Get all messages for this conversation, but only those where the current user is a participant
    const conversationMessages = allMessages.filter(
      message =>
        conversation.participants.includes(message.senderId) &&
        conversation.participants.includes(message.receiverId) &&
        (message.senderId === (currentUser?.id ?? "") || message.receiverId === (currentUser?.id ?? ""))
    );

    setCurrentMessages(conversationMessages);

    // Mark messages as read
    markConversationAsRead(currentConversationId);
  }, [currentConversationId, conversations, allMessages, currentUser]);
  
  const selectConversation = (conversationId: string | null) => {
    setCurrentConversationId(conversationId);
  };
  
  const sendMessage = (text: string, audioUrl?: string) => {
    if (!currentConversationId || (!text.trim() && !audioUrl)) return;
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;
    
    // Find the other participant
    const otherUserId = conversation.participants.find(id => id !== (currentUser?.id ?? ""));
    if (!otherUserId || !currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUserId,
      ...(audioUrl
        ? { audioUrl, text: "" }
        : { text: text.trim() }),
      timestamp: new Date(),
      read: false
    };

    setAllMessages(prev => [...prev, newMessage]);
  };
  
  const markConversationAsRead = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Mark all messages in this conversation as read
    if (!currentUser) return;
    setAllMessages(prev =>
      prev.map(message => {
        if (
          conversation.participants.includes(message.senderId) &&
          conversation.participants.includes(message.receiverId) &&
          message.senderId !== currentUser.id &&
          !message.read
        ) {
          return { ...message, read: true };
        }
        return message;
      })
    );
  };
  
  const createNewConversation = (userId: string): string => {
    // Create conversation key (always sort IDs to ensure consistency)
    if (!currentUser) return "";
    const participantIds = [currentUser.id, userId].sort();
    const conversationId = `conv_${participantIds.join('_')}`;

    const existingConversation = conversations.find(c => c.id === conversationId);
    if (existingConversation) {
      selectConversation(conversationId);
      return conversationId;
    }

    setConversations(prev => {
      const newConvs = [
        {
          id: conversationId,
          participants: participantIds,
          lastMessage: null,
          unreadCount: 0
        },
        ...prev
      ];
      setCurrentConversationId(conversationId);
      return newConvs;
    });

    return conversationId;
  };
  
  return (
    <ChatContext.Provider 
      value={{
        conversations,
        currentConversation: conversations.find(c => c.id === currentConversationId) || null,
        messages: currentMessages,
        selectConversation,
        sendMessage,
        markConversationAsRead,
        createNewConversation
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
