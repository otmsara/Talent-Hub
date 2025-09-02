
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Award, Star, Bot, PenTool } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummyPrompts } from '@/data/dummyPrompts';
import { dummyAgents } from '@/data/dummyAgents';

// Calculate creator stats from prompts and agents
const calculateCreatorStats = () => {
  const creatorStats = new Map();
  
  // Process prompts
  dummyPrompts.forEach(prompt => {
    const creatorId = prompt.creator.id;
    if (!creatorStats.has(creatorId)) {
      creatorStats.set(creatorId, {
        id: creatorId,
        name: prompt.creator.name,
        avatar: prompt.creator.avatar,
        promptSales: 0,
        agentSales: 0,
        totalSales: 0,
        promptRating: 0,
        agentRating: 0,
        promptCount: 0,
        agentCount: 0,
      });
    }
    
    const stats = creatorStats.get(creatorId);
    stats.promptSales += prompt.purchases;
    stats.totalSales += prompt.purchases;
    stats.promptRating += prompt.averageRating;
    stats.promptCount += 1;
  });
  
  // Process agents
  dummyAgents.forEach(agent => {
    const creatorId = agent.creator.id;
    if (!creatorStats.has(creatorId)) {
      creatorStats.set(creatorId, {
        id: creatorId,
        name: agent.creator.name,
        avatar: agent.creator.avatar,
        promptSales: 0,
        agentSales: 0,
        totalSales: 0,
        promptRating: 0,
        agentRating: 0,
        promptCount: 0,
        agentCount: 0,
      });
    }
    
    const stats = creatorStats.get(creatorId);
    stats.agentSales += agent.purchases;
    stats.totalSales += agent.purchases;
    stats.agentRating += agent.averageRating;
    stats.agentCount += 1;
  });
  
  // Calculate average ratings
  creatorStats.forEach(stats => {
    stats.promptRating = stats.promptCount > 0 ? stats.promptRating / stats.promptCount : 0;
    stats.agentRating = stats.agentCount > 0 ? stats.agentRating / stats.agentCount : 0;
    stats.averageRating = (stats.promptCount + stats.agentCount > 0) ? 
      (stats.promptRating * stats.promptCount + stats.agentRating * stats.agentCount) / 
      (stats.promptCount + stats.agentCount) : 0;
  });
  
  return Array.from(creatorStats.values());
};

const creatorStats = calculateCreatorStats();

const LeaderboardCard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'prompts' | 'agents'>('all');
  
  // Sort creators based on the active tab
  const sortedCreators = [...creatorStats].sort((a, b) => {
    if (activeTab === 'all') {
      return b.totalSales - a.totalSales;
    } else if (activeTab === 'prompts') {
      return b.promptSales - a.promptSales;
    } else {
      return b.agentSales - a.agentSales;
    }
  }).slice(0, 5);
  
  return (
    <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-0 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Trophy className="h-5 w-5 text-primary" />
          Top Creators
        </CardTitle>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'all' | 'prompts' | 'agents')}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="all" className="text-xs py-1.5">All</TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center justify-center gap-1 text-xs py-1.5">
              <PenTool className="h-3 w-3" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center justify-center gap-1 text-xs py-1.5">
              <Bot className="h-3 w-3" />
              Agents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <div className="px-3 py-2">
          <div className="grid grid-cols-12 text-xs text-muted-foreground mb-1">
            <div className="col-span-1 pl-2">Rank</div>
            <div className="col-span-7">Creator</div>
            <div className="col-span-2 text-right">Sales</div>
            <div className="col-span-2 text-right pr-2">Rating</div>
          </div>
        </div>

        <div className="divide-y divide-border/30">
          {sortedCreators.map((creator, index) => (
            <div key={creator.id} className="grid grid-cols-12 items-center py-3 px-3 hover:bg-primary/5 transition-colors">
              <div className="col-span-1 flex justify-center">
                {index === 0 ? (
                  <Trophy className="h-5 w-5 text-primary" />
                ) : index === 1 ? (
                  <Award className="h-5 w-5 text-gray-400" />
                ) : index === 2 ? (
                  <Award className="h-5 w-5 text-amber-700" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="col-span-7">
                <Link to={`/profile/${creator.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{creator.name}</div>
                    {index <= 1 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 border-primary/30">
                        {index === 0 ? 'Top Creator' : 'Rising Star'}
                      </Badge>
                    )}
                  </div>
                </Link>
              </div>
              <div className="col-span-2 text-right font-medium text-sm">
                {activeTab === 'all' ? creator.totalSales : 
                 activeTab === 'prompts' ? creator.promptSales : 
                 creator.agentSales}
              </div>
              <div className="col-span-2 text-right flex items-center justify-end pr-2">
                <Star className="h-3 w-3 text-primary fill-primary mr-1" />
                <span className="text-sm">
                  {activeTab === 'all' ? creator.averageRating.toFixed(1) : 
                  activeTab === 'prompts' ? creator.promptRating.toFixed(1) : 
                  creator.agentRating.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
