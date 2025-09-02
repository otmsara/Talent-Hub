import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/ui/card';
import PromptCard from '../components/marketplace/PromptCard';
import AgentCard from '../components/marketplace/AgentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { dummyPrompts } from '../data/dummyPrompts';
import { dummyAgents } from '../data/dummyAgents';
import SubscriptionCard from '../components/marketplace/SubscriptionCard';
import CreatePromptForm from '../components/marketplace/CreatePromptForm';
import { Button } from '../components/ui/button';
import { nanoid } from 'nanoid';
import UserWallet from '../components/marketplace/UserWallet';
import PurchasedItems from '../components/marketplace/PurchasedItems';
import LeaderboardCard from '../components/marketplace/LeaderboardCard';
import DiscussionFeed from '../components/marketplace/DiscussionFeed';
import DiscoveryModal from '../components/marketplace/DiscoveryModal';
import { Sparkles, CompassIcon, PenTool, Bot } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [category, setCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [marketKey, setMarketKey] = useState(nanoid(6));
  const [activeTab, setActiveTab] = useState<'browse' | 'purchased' | 'community'>('browse');
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [productType, setProductType] = useState<'prompts' | 'agents'>('prompts');
  
  const categories = ['all'];
  
  if (productType === 'prompts') {
    dummyPrompts.forEach(prompt => {
      if (!categories.includes(prompt.category)) {
        categories.push(prompt.category);
      }
    });
  } else {
    dummyAgents.forEach(agent => {
      if (!categories.includes(agent.category)) {
        categories.push(agent.category);
      }
    });
  }
  
  const filteredPrompts = category === 'all' 
    ? dummyPrompts 
    : dummyPrompts.filter(prompt => prompt.category === category);
    
  const filteredAgents = category === 'all' 
    ? dummyAgents 
    : dummyAgents.filter(agent => agent.category === category);
  
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  
  const handleItemCreated = () => {
    setShowCreateForm(false);
    setMarketKey(nanoid(6)); // Force re-render
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">AI Marketplace</h1>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex items-center gap-1"
                onClick={() => {
                  toast.info("Subscription options coming soon");
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sphere+
              </Button>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Discover and purchase high-quality LLM prompts and AI agents created by the community. 
              Enhance your AI interactions with professionally crafted tools.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsDiscoveryOpen(true)}
            variant="outline"
            className="gap-2 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
          >
            <CompassIcon className="w-4 h-4" />
            Discovery Center
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UserWallet />
          <div className="flex items-center justify-center">
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="browse" 
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Marketplace
                </TabsTrigger>
                <TabsTrigger 
                  value="purchased" 
                  onClick={() => setActiveTab('purchased')}
                >
                  My Purchases
                </TabsTrigger>
                <TabsTrigger 
                  value="community" 
                  onClick={() => setActiveTab('community')}
                >
                  Community
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {showCreateForm ? (
          <CreatePromptForm onClose={handleItemCreated} />
        ) : (
          <>
            {activeTab === 'browse' ? (
              <>
                <div className="mb-6">
                  <Tabs defaultValue="prompts" onValueChange={(value) => setProductType(value as 'prompts' | 'agents')}>
                    <TabsList className="w-full md:w-auto">
                      <TabsTrigger value="prompts" className="flex gap-1 items-center">
                        <PenTool className="h-4 w-4" />
                        Prompts
                      </TabsTrigger>
                      <TabsTrigger value="agents" className="flex gap-1 items-center">
                        <Bot className="h-4 w-4" />
                        AI Agents
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <Tabs defaultValue={category} value={category} className="w-full mb-8">
                  <TabsList className="mb-4 bg-secondary/30 p-1 overflow-x-auto flex-wrap">
                    {categories.map(cat => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        onClick={() => setCategory(cat)}
                        className="capitalize"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value={category} className="mt-0">
                    {productType === 'prompts' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrompts.map((prompt) => (
                          <PromptCard key={`${prompt.id}-${marketKey}`} prompt={prompt} />
                        ))}
                        
                        {filteredPrompts.length === 0 && (
                          <Card className="col-span-full p-8 text-center">
                            <p className="text-muted-foreground">No prompts found in this category.</p>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAgents.map((agent) => (
                          <AgentCard key={`${agent.id}-${marketKey}`} agent={agent} />
                        ))}
                        
                        {filteredAgents.length === 0 && (
                          <Card className="col-span-full p-8 text-center">
                            <p className="text-muted-foreground">No agents found in this category.</p>
                          </Card>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            ) : activeTab === 'purchased' ? (
              <PurchasedItems />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <LeaderboardCard />
                </div>
                <div className="lg:col-span-2">
                  <DiscussionFeed />
                </div>
              </div>
            )}
            
            <div className="bg-secondary/20 border border-border/30 rounded-lg p-6 backdrop-blur-sm mt-8">
              <h2 className="text-xl font-semibold mb-3">Become a Creator</h2>
              <p className="text-muted-foreground mb-4">
                Share your expertise by creating and selling your own LLM prompts and AI agents. Set your own prices and earn when others use your creations.
              </p>
              <Button onClick={toggleCreateForm}>Start Creating</Button>
            </div>
          </>
        )}
      </div>
      
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
    </Layout>
  );
};

export default Marketplace;
