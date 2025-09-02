
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Agent } from '../../data/dummyAgents';
import { Badge } from '../ui/badge';
import { Sparkles, ShoppingCart, Check, MessageSquare, Star, Code, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletStore } from '../../data/walletStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { balance, deductBalance, addPurchasedAgent, isPurchased, addReview, getReviewForAgent } = useWalletStore();
  const alreadyPurchased = isPurchased(agent.id, 'agent');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isCodeAccessOpen, setIsCodeAccessOpen] = useState(false);
  
  const existingReview = getReviewForAgent(agent.id);
  const [review, setReview] = useState(existingReview?.comment || '');
  const [rating, setRating] = useState(existingReview?.rating || 5);
  
  const handlePurchase = () => {
    if (alreadyPurchased) {
      toast.info(`You already own "${agent.title}"`);
      return;
    }
    
    if (balance < agent.price) {
      toast.error(`Insufficient funds. You need $${agent.price.toFixed(2)} to purchase this agent.`);
      return;
    }
    
    // Process the purchase
    deductBalance(agent.price);
    addPurchasedAgent(agent.id);
    
    toast.success(`You've purchased "${agent.title}" for $${agent.price.toFixed(2)}`);
  };

  const handleSubmitReview = () => {
    if (rating < 1 || rating > 10) {
      toast.error("Rating must be between 1 and 10");
      return;
    }

    // Add the review to the user's wallet
    addReview({
      agentId: agent.id,
      rating,
      comment: review,
      date: new Date().toISOString().split('T')[0]
    });

    // In a real app, we'd save this to a database and update the agent's reviews
    toast.success("Thank you for your review!");
    setIsReviewOpen(false);
  };

  return (
    <Card className="overflow-hidden border border-border/40 bg-secondary/10 backdrop-blur-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={agent.creator.avatar} alt={agent.creator.name} />
              <AvatarFallback>{agent.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 mb-0.5">
                <h3 className="font-semibold text-sm truncate">{agent.title}</h3>
                <Bot className="h-3 w-3 text-primary flex-shrink-0" />
              </div>
              <Link 
                to={`/profile/${agent.creator.id}`} 
                className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block"
              >
                by {agent.creator.name}
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {agent.category}
            </Badge>
            {agent.reviews.length > 0 && (
              <button 
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span>{agent.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({agent.reviews.length})</span>
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow flex flex-col">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
        </div>
        
        <div className="mt-2 flex-grow">
          <h4 className="text-xs font-semibold mb-1.5">Capabilities:</h4>
          <ul className="grid grid-cols-1 gap-1">
            {agent.capabilities.map((capability, index) => (
              <li key={index} className="text-xs flex items-start gap-1.5 leading-tight">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                <span className="line-clamp-1">{capability}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {agent.codeAccess && (
          <div className="mt-3">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30">
              <Code className="h-3 w-3 mr-1" />
              Includes Source Code
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between mt-auto border-t border-border/20">
        <div className="flex items-center gap-2">
          {agent.isPremium && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          <span className="font-bold">${agent.price.toFixed(2)}</span>
        </div>
        
        <div className="flex gap-2 flex-wrap justify-end">
          {alreadyPurchased ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 bg-green-500/10 text-green-600 border-green-500/30 h-8 px-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Owned</span>
              </Button>
              {agent.codeAccess && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/30 h-8 px-2"
                  onClick={() => setIsCodeAccessOpen(true)}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Code</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-8 px-2"
                onClick={() => setIsReviewOpen(true)}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{existingReview ? 'Edit' : 'Review'}</span>
              </Button>
            </>
          ) : (
            <Button onClick={handlePurchase} size="sm" className="gap-1 h-8">
              <ShoppingCart className="w-3.5 h-3.5" />
              Buy
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review: {agent.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rating" className="block mb-2">
                Rating (1-10)
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="rating"
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center gap-1 min-w-[40px]">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{rating}</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="review" className="block mb-2">
                Your Review
              </Label>
              <Textarea
                id="review"
                placeholder="Share your thoughts about this agent..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reviews List Dialog */}
      <Dialog open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reviews for {agent.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {agent.reviews.length > 0 ? (
              <div className="space-y-4">
                {agent.reviews.map((review, index) => (
                  <div key={index} className="border-b border-border/30 pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{review.username}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No reviews yet</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsReviewsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Access Dialog */}
      <Dialog open={isCodeAccessOpen} onOpenChange={setIsCodeAccessOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Source Code: {agent.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-black/90 text-green-400 font-mono p-4 rounded-md overflow-x-auto text-sm">
              <pre>{`// Agent Source Code: ${agent.title}
import { useState, useEffect } from 'react';

export function useAgentHook() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);

  // Agent implementation details
  const processInput = async (input) => {
    setIsProcessing(true);
    
    try {
      // Simulated AI processing
      const response = await fetch('/api/agent-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, agentId: '${agent.id}' }),
      });
      
      const data = await response.json();
      setResults(prev => [...prev, data.result]);
    } catch (error) {
      console.error('Agent processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processInput,
    isProcessing,
    results,
    clearResults: () => setResults([]),
  };
}

// Agent configuration
export const agentConfig = {
  name: '${agent.title}',
  version: '1.0.0',
  capabilities: ${JSON.stringify(agent.capabilities, null, 2)},
  author: '${agent.creator.name}',
  license: 'MIT',
};

// Main agent component
export default function Agent() {
  const { processInput, isProcessing, results, clearResults } = useAgentHook();
  
  // Agent UI implementation
  return (
    <div className="agent-container">
      {/* Agent UI code */}
    </div>
  );
}`}</pre>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Implementation Notes:</h4>
              <p className="text-sm text-muted-foreground">
                This source code provides the foundation for implementing {agent.title} in your own applications. 
                The agent uses React hooks for state management and includes a simulated API endpoint for processing.
              </p>
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <h5 className="text-sm font-medium text-blue-500 mb-1">Installation Instructions:</h5>
                <ol className="text-xs text-muted-foreground list-decimal ml-4 space-y-1">
                  <li>Copy the code to your project</li>
                  <li>Import the Agent component or useAgentHook in your application</li>
                  <li>Implement the API endpoint or replace with your preferred processing method</li>
                  <li>Customize the UI components to match your application's design</li>
                </ol>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(document.querySelector('pre')?.innerText || '')}>
              Copy Code
            </Button>
            <Button onClick={() => setIsCodeAccessOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AgentCard;
