
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Check, X, Bot, PenTool, Code } from 'lucide-react';
import { toast } from 'sonner';
import { currentUser } from '../../data/dummyData';
import { dummyPrompts } from '../../data/dummyPrompts';
import { dummyAgents } from '../../data/dummyAgents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface CreatePromptFormProps {
  onClose: () => void;
}

const CreatePromptForm: React.FC<CreatePromptFormProps> = ({ onClose }) => {
  const [productType, setProductType] = useState<'prompt' | 'agent'>('prompt');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('2.99');
  const [category, setCategory] = useState('productivity');
  const [isPremium, setIsPremium] = useState(false);
  const [capabilities, setCapabilities] = useState('');
  const [codeAccess, setCodeAccess] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  
  const categories = ['productivity', 'business', 'programming', 'marketing', 'creativity', 'data science', 'career'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !category) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (productType === 'prompt' && !content) {
      toast.error('Please enter prompt content');
      return;
    }
    
    if (productType === 'agent' && !capabilities) {
      toast.error('Please enter agent capabilities');
      return;
    }
    
    if (productType === 'agent' && codeAccess && !codeContent) {
      toast.error('Please enter code content for your agent');
      return;
    }
    
    if (productType === 'prompt') {
      // Create new prompt
      const newPrompt = {
        id: `p${dummyPrompts.length + 1}`,
        title,
        description,
        content,
        price: parseFloat(price),
        category,
        creator: currentUser,
        isPremium,
        purchases: 0,
        reviews: [],
        averageRating: 0
      };
      
      // Add to dummy prompts array
      dummyPrompts.unshift(newPrompt);
      toast.success('Your prompt has been published');
    } else {
      // Create new agent
      const capabilitiesArray = capabilities.split('\n').filter(cap => cap.trim() !== '');
      
      const newAgent = {
        id: `a${dummyAgents.length + 1}`,
        title,
        description,
        price: parseFloat(price),
        category,
        creator: currentUser,
        isPremium,
        capabilities: capabilitiesArray,
        codeAccess: codeAccess,
        purchases: 0,
        reviews: [],
        averageRating: 0
      };
      
      // Add to dummy agents array
      dummyAgents.unshift(newAgent);
      toast.success('Your AI agent has been published');
    }
    
    onClose();
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-xl font-bold">Create a New {productType === 'prompt' ? 'Prompt' : 'AI Agent'}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <Tabs defaultValue="prompt" onValueChange={(value) => setProductType(value as 'prompt' | 'agent')}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompt" className="flex gap-1 items-center">
                <PenTool className="h-4 w-4" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex gap-1 items-center">
                <Bot className="h-4 w-4" />
                AI Agent
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt" className="mt-0">
              {/* Prompt specific fields */}
              <div className="space-y-2">
                <Label htmlFor="prompt-content">Prompt Content</Label>
                <Textarea 
                  id="prompt-content" 
                  placeholder="Enter the full prompt here..." 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="min-h-32"
                  required
                />
                <p className="text-xs text-muted-foreground">This is the content that buyers will receive.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="agent" className="mt-0">
              {/* Agent specific fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capabilities">Agent Capabilities (one per line)</Label>
                  <Textarea 
                    id="capabilities" 
                    placeholder="Data analysis\nNatural language processing\nAutomated reporting" 
                    value={capabilities} 
                    onChange={(e) => setCapabilities(e.target.value)} 
                    className="min-h-24"
                    required
                  />
                  <p className="text-xs text-muted-foreground">List each capability on a new line.</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="codeAccess" 
                    checked={codeAccess} 
                    onChange={(e) => setCodeAccess(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="codeAccess" className="text-sm font-normal flex items-center">
                    <Code className="h-4 w-4 mr-1 text-blue-500" />
                    Include Source Code
                  </Label>
                </div>
                
                {codeAccess && (
                  <div className="space-y-2">
                    <Label htmlFor="codeContent">Source Code</Label>
                    <Textarea 
                      id="codeContent" 
                      placeholder="// Paste your agent's code here..." 
                      value={codeContent} 
                      onChange={(e) => setCodeContent(e.target.value)} 
                      className="min-h-32 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">This code will be available to buyers after purchase.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Common fields for both prompts and agents */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder={`E.g., ${productType === 'prompt' ? 'Professional Email Writer' : 'Data Analysis Assistant'}`}
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              placeholder={`Short description of what your ${productType} does`}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                min="0.10" 
                step="0.01" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="premium" 
              checked={isPremium} 
              onChange={(e) => setIsPremium(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="premium" className="text-sm font-normal">Mark as Premium {productType === 'prompt' ? 'Prompt' : 'Agent'}</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Check className="mr-2 h-4 w-4" />
            Publish {productType === 'prompt' ? 'Prompt' : 'Agent'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePromptForm;
