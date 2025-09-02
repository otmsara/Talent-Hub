
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LightbulbIcon, BookIcon, CompassIcon, Star } from 'lucide-react';

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const successStories = [
  {
    id: 1,
    user: {
      name: 'Jessica Miller',
      role: 'Content Creator',
      avatar: '/placeholder.svg'
    },
    title: 'Tripled My Blog Traffic',
    content: 'I purchased the "SEO Content Optimizer" prompt and used it to rewrite my existing blog posts. Within two months, my organic traffic tripled and I started getting inquiries from companies wanting to partner with me.',
    promptName: 'SEO Content Optimizer',
    results: ['3x traffic increase', '15+ partnership inquiries', '$2,400 in new revenue']
  },
  {
    id: 2,
    user: {
      name: 'Michael Chang',
      role: 'E-commerce Owner',
      avatar: '/placeholder.svg'
    },
    title: 'Product Descriptions That Sell',
    content: 'The "E-commerce Product Description Generator" prompt helped me create compelling descriptions for my entire catalog of 200+ products in just two days. Conversion rates increased by 23% in the first month after implementation.',
    promptName: 'E-commerce Product Description Generator',
    results: ['23% higher conversion rate', 'Saved 40+ hours of work', '$5,100 in additional monthly sales']
  }
];

const howToGuides = [
  {
    id: 1,
    title: 'Getting Started with AI Prompts',
    description: 'Learn the basics of prompt engineering and how to get the most out of marketplace prompts',
    steps: [
      'Understand your goal before selecting a prompt',
      'Read the prompt documentation carefully',
      'Customize the prompt for your specific needs',
      'Test with different inputs to optimize results'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 2,
    title: 'Chaining Prompts Together for Complex Tasks',
    description: 'Create powerful workflows by combining multiple specialized prompts',
    steps: [
      'Break down your complex task into smaller steps',
      'Select specialized prompts for each step',
      'Use output formatting to ensure compatibility between prompts',
      'Create a system for passing data between prompt stages'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Creating Your First Marketplace Prompt',
    description: 'Turn your expertise into a valuable prompt that others will pay for',
    steps: [
      'Identify your unique area of expertise',
      'Design a prompt that delivers clear value',
      'Test thoroughly with different inputs',
      'Create comprehensive documentation',
      'Set the right price point for your target audience'
    ],
    difficulty: 'Advanced'
  }
];

const opportunities = [
  {
    id: 1,
    category: 'High Demand',
    title: 'Legal Document Analysis',
    description: 'Specialized prompts that help analyze contracts and legal documents are in high demand with very few options currently available.',
    potentialEarnings: '$1,000-$2,500/month',
    difficultyLevel: 'Expert'
  },
  {
    id: 2,
    category: 'Trending',
    title: 'AI-assisted Video Script Writing',
    description: 'With the rise of short-form content, video script prompts optimized for platforms like TikTok and YouTube Shorts are gaining popularity.',
    potentialEarnings: '$500-$1,200/month',
    difficultyLevel: 'Intermediate'
  },
  {
    id: 3,
    category: 'Underserved',
    title: 'Scientific Research Assistance',
    description: 'Prompts that help researchers analyze data, generate hypotheses, and draft academic papers are scarce but highly valued.',
    potentialEarnings: '$800-$1,800/month',
    difficultyLevel: 'Expert'
  },
  {
    id: 4,
    category: 'Beginner Friendly',
    title: 'Social Media Content Calendars',
    description: 'Create prompts that generate monthly content calendars for specific niches like fitness, food, or fashion.',
    potentialEarnings: '$300-$800/month',
    difficultyLevel: 'Beginner'
  }
];

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Prompt Discovery Center</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="success-stories" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="success-stories" className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Success Stories
            </TabsTrigger>
            <TabsTrigger value="how-to" className="flex items-center gap-2">
              <BookIcon className="h-4 w-4" />
              How-To Guides
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4" />
              Opportunities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="success-stories" className="pt-4">
            <div className="space-y-6">
              {successStories.map(story => (
                <Card key={story.id} className="border-border/40 bg-secondary/10">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={story.user.avatar} alt={story.user.name} />
                          <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                          <CardDescription>{story.user.name} • {story.user.role}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                        Success Story
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{story.content}</p>
                    <div className="bg-background/30 p-3 rounded-md mb-3">
                      <p className="text-sm font-semibold">Prompt Used: {story.promptName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.results.map((result, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 border-primary/30">
                          {result}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="how-to" className="pt-4">
            <div className="space-y-6">
              {howToGuides.map(guide => (
                <Card key={guide.id} className="border-border/40 bg-secondary/10">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                      <Badge className={
                        guide.difficulty === 'Beginner' ? "bg-green-500/20 text-green-500 border-green-500/30" :
                        guide.difficulty === 'Intermediate' ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                        "bg-red-500/20 text-red-500 border-red-500/30"
                      }>
                        {guide.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {guide.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {opportunities.map(opportunity => (
                <Card key={opportunity.id} className="border-border/40 bg-secondary/10">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {opportunity.category}
                      </Badge>
                    </div>
                    <CardDescription>{opportunity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Potential earnings:</span>
                        <span className="font-semibold text-green-500">{opportunity.potentialEarnings}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Difficulty level:</span>
                        <Badge variant="outline" className={
                          opportunity.difficultyLevel === 'Beginner' ? "bg-green-500/10 text-green-500 border-green-500/30" :
                          opportunity.difficultyLevel === 'Intermediate' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                          "bg-red-500/10 text-red-500 border-red-500/30"
                        }>
                          {opportunity.difficultyLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DiscoveryModal;
