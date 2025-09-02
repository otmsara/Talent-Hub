
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Review {
  promptId?: string;
  agentId?: string;
  rating: number;
  comment: string;
  date: string;
}

interface WalletState {
  balance: number;
  purchasedPrompts: string[];
  purchasedAgents: string[];
  reviews: Review[];
  deductBalance: (amount: number) => void;
  addPurchasedPrompt: (promptId: string) => void;
  addPurchasedAgent: (agentId: string) => void;
  isPurchased: (id: string, type?: 'prompt' | 'agent') => boolean;
  addReview: (review: Review) => void;
  getReviewForPrompt: (promptId: string) => Review | undefined;
  getReviewForAgent: (agentId: string) => Review | undefined;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 1000, // Initial balance of $1000
      purchasedPrompts: [],
      purchasedAgents: [],
      reviews: [],
      
      deductBalance: (amount: number) => 
        set((state) => ({ balance: state.balance - amount })),
      
      addPurchasedPrompt: (promptId: string) => 
        set((state) => ({
          purchasedPrompts: [...state.purchasedPrompts, promptId]
        })),
        
      addPurchasedAgent: (agentId: string) => 
        set((state) => ({
          purchasedAgents: [...state.purchasedAgents, agentId]
        })),
      
      isPurchased: (id: string, type: 'prompt' | 'agent' = 'prompt') => 
        type === 'prompt' 
          ? get().purchasedPrompts.includes(id)
          : get().purchasedAgents.includes(id),
        
      addReview: (review: Review) =>
        set((state) => {
          // Remove any existing review for this prompt or agent
          const filteredReviews = state.reviews.filter(r => 
            (review.promptId && r.promptId !== review.promptId) || 
            (review.agentId && r.agentId !== review.agentId)
          );
          // Add the new review
          return { reviews: [...filteredReviews, review] };
        }),
        
      getReviewForPrompt: (promptId: string) =>
        get().reviews.find(review => review.promptId === promptId),
        
      getReviewForAgent: (agentId: string) =>
        get().reviews.find(review => review.agentId === agentId)
    }),
    {
      name: 'wallet-storage', // unique name for localStorage
    }
  )
);
