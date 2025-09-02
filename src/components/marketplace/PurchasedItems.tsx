
import React, { useState } from 'react';
import { useWalletStore } from '../../data/walletStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { dummyPrompts } from '../../data/dummyPrompts';
import { dummyAgents } from '../../data/dummyAgents';
import { Badge } from '../ui/badge';
import { Check, Code, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

const PurchasedItems = () => {
  const { purchasedPrompts, purchasedAgents } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'prompts' | 'agents'>('prompts');
  const [selectedAgentCode, setSelectedAgentCode] = useState<string | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  
  const purchasedPromptDetails = dummyPrompts.filter(prompt => 
    purchasedPrompts.includes(prompt.id)
  );

  const purchasedAgentDetails = dummyAgents.filter(agent => 
    purchasedAgents.includes(agent.id)
  );

  const openCodeModal = (agentId: string) => {
    setSelectedAgentCode(agentId);
    setIsCodeModalOpen(true);
  };

  const selectedAgent = selectedAgentCode ? dummyAgents.find(a => a.id === selectedAgentCode) : null;

  return (
    <Card className="bg-secondary/10 backdrop-blur-sm">
      <CardHeader>
        <Tabs defaultValue="prompts" onValueChange={(value) => setActiveTab(value as 'prompts' | 'agents')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompts">My Prompts</TabsTrigger>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {activeTab === 'prompts' && (
          <>
            {purchasedPromptDetails.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You haven't purchased any prompts yet.
              </p>
            ) : (
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
            )}
          </>
        )}
        
        {activeTab === 'agents' && (
          <>
            {purchasedAgentDetails.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You haven't purchased any agents yet.
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {purchasedAgentDetails.map(agent => (
                    <div 
                      key={agent.id}
                      className="p-3 rounded-md bg-secondary/20 border border-border/30 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium flex items-center">
                            {agent.title}
                            <Bot className="w-3 h-3 text-primary ml-1" />
                          </h3>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            ${agent.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {agent.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {agent.codeAccess && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-blue-500/10 text-blue-600 border-blue-500/30"
                            onClick={() => openCodeModal(agent.id)}
                          >
                            <Code className="w-3 h-3 mr-1" />
                            Code
                          </Button>
                        )}
                        <Badge className="bg-green-500 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Owned
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}

        {/* Code Access Modal */}
        {selectedAgent && (
          <Dialog open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Source Code: {selectedAgent.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-black/90 text-green-400 font-mono p-4 rounded-md overflow-x-auto text-sm">
                  <pre>{`// Agent Source Code: ${selectedAgent.title}
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
        body: JSON.stringify({ input, agentId: '${selectedAgent.id}' }),
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
  name: '${selectedAgent.title}',
  version: '1.0.0',
  capabilities: ${JSON.stringify(selectedAgent.capabilities, null, 2)},
  author: '${selectedAgent.creator.name}',
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(document.querySelector('pre')?.innerText || '')}>
                  Copy Code
                </Button>
                <Button onClick={() => setIsCodeModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchasedItems;
