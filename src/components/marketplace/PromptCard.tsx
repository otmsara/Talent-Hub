
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Prompt } from '../../data/dummyPrompts';
import { Badge } from '../ui/badge';
import { Sparkles, Eye, ShoppingCart, Check, MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletStore } from '../../data/walletStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const { balance, deductBalance, addPurchasedPrompt, isPurchased, addReview, getReviewForPrompt } = useWalletStore();
  const alreadyPurchased = isPurchased(prompt.id);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  
  const existingReview = getReviewForPrompt(prompt.id);
  const [review, setReview] = useState(existingReview?.comment || '');
  const [rating, setRating] = useState(existingReview?.rating || 5);
  
  const handlePurchase = () => {
    if (alreadyPurchased) {
      toast.info(`You already own "${prompt.title}"`);
      return;
    }
    
    if (balance < prompt.price) {
      toast.error(`Insufficient funds. You need $${prompt.price.toFixed(2)} to purchase this prompt.`);
      return;
    }
    
    // Process the purchase
    deductBalance(prompt.price);
    addPurchasedPrompt(prompt.id);
    
    toast.success(`You've purchased "${prompt.title}" for $${prompt.price.toFixed(2)}`);
  };
  
  const togglePreview = () => {
    setIsPreviewActive(!isPreviewActive);
  };

  const getPreviewContent = () => {
    if (alreadyPurchased) {
      return prompt.content;
    }
    
    // Show approximately 1/3 of the content
    const previewLength = Math.floor(prompt.content.length / 3);
    return isPreviewActive ? prompt.content.substring(0, previewLength) + '...' : prompt.content.substring(0, 50) + '...';
  };

  const handleSubmitReview = () => {
    if (rating < 1 || rating > 10) {
      toast.error("Rating must be between 1 and 10");
      return;
    }

    // Add the review to the user's wallet
    addReview({
      promptId: prompt.id,
      rating,
      comment: review,
      date: new Date().toISOString().split('T')[0]
    });

    // In a real app, we'd save this to a database and update the prompt's reviews
    toast.success("Thank you for your review!");
    setIsReviewOpen(false);
  };

  return (
    <Card className="overflow-hidden border border-border/40 bg-secondary/10 backdrop-blur-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={prompt.creator.avatar} alt={prompt.creator.name} />
              <AvatarFallback>{prompt.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 overflow-hidden">
              <h3 className="font-semibold text-sm truncate mb-0.5">{prompt.title}</h3>
              <Link 
                to={`/profile/${prompt.creator.id}`} 
                className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block"
              >
                by {prompt.creator.name}
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {prompt.category}
            </Badge>
            {prompt.reviews.length > 0 && (
              <button 
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span>{prompt.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({prompt.reviews.length})</span>
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
        </div>
        
        <div className="relative mt-3 bg-secondary/30 rounded-md p-3 min-h-[100px] max-h-[150px] overflow-auto">
          {/* Blurred preview */}
          <div 
            className={`${isPreviewActive || alreadyPurchased ? 'opacity-100' : 'opacity-20 blur-sm'} transition-all duration-300`}
          >
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {getPreviewContent()}
            </pre>
          </div>
          
          {/* Preview toggle button (only show if not purchased) */}
          {!isPreviewActive && !alreadyPurchased && (
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black/30 text-white hover:bg-black/40 transition-all rounded-md"
              onClick={togglePreview}
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </button>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between mt-auto border-t border-border/20">
        <div className="flex items-center gap-2">
          {prompt.isPremium && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          <span className="font-bold">${prompt.price.toFixed(2)}</span>
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
            <DialogTitle>Review: {prompt.title}</DialogTitle>
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
                placeholder="Share your thoughts about this prompt..."
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
            <DialogTitle>Reviews for {prompt.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {prompt.reviews.length > 0 ? (
              <div className="space-y-4">
                {prompt.reviews.map((review, index) => (
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
    </Card>
  );
};

export default PromptCard;
