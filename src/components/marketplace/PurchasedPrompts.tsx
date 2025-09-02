
import React from 'react';
import { useWalletStore } from '../../data/walletStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { dummyPrompts } from '../../data/dummyPrompts';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';

const PurchasedPrompts = () => {
  const { purchasedPrompts } = useWalletStore();
  
  const purchasedPromptDetails = dummyPrompts.filter(prompt => 
    purchasedPrompts.includes(prompt.id)
  );

  if (purchasedPromptDetails.length === 0) {
    return (
      <Card className="bg-secondary/10 backdrop-blur-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold">My Purchased Prompts</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">
            You haven't purchased any prompts yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/10 backdrop-blur-sm">
      <CardHeader>
        <h2 className="text-xl font-semibold">My Purchased Prompts</h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {purchasedPromptDetails.map(prompt => (
              <div 
                key={prompt.id}
                className="p-3 rounded-md bg-secondary/20 border border-border/30 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{prompt.title}</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      ${prompt.price.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {prompt.description}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Owned
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PurchasedPrompts;
