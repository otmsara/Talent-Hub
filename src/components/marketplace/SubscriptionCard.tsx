
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionCard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSubscribe = () => {
    setIsOpen(false);
    toast.success("You've successfully subscribed to Sphere+ Premium!");
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="sm"
        className="gap-2 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
      >
        <Sparkles className="w-3 h-3" />
        Premium
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Sphere+ Premium Subscription
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold">$19.99</span>
              <span className="text-sm text-muted-foreground">/month</span>
              <Badge className="ml-2 bg-primary text-primary-foreground">Save 30%</Badge>
            </div>
            
            <ul className="space-y-2">
              {[
                "Unlimited access to all prompts",
                "Early access to new prompts",
                "Prompt customization tools",
                "Priority support"
              ].map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Check className="w-4 h-4 text-primary mr-2 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSubscribe} className="w-full" variant="default">
              Subscribe Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionCard;
