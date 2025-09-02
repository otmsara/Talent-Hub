
import { User, findUserById } from './dummyData';

export interface Agent {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
  codeAccess: boolean;
  price: number;
  category: string;
  creator: User;
  isPremium: boolean;
  purchases: number;
  reviews: {
    userId: string;
    username: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  averageRating: number;
}

export const dummyAgents: Agent[] = [
  {
    id: 'a1',
    title: 'Research Assistant Pro',
    description: 'AI agent that helps with academic research and citation management.',
    capabilities: [
      'Literature search automation',
      'Citation formatting',
      'Research summarization',
      'Question answering based on sources'
    ],
    codeAccess: true,
    price: 19.99,
    category: 'productivity',
    creator: findUserById('u1'),
    isPremium: true,
    purchases: 87,
    reviews: [
      {
        userId: 'u3',
        username: 'Alex Johnson',
        rating: 9,
        comment: 'Helped me finish my thesis in half the time. Amazing at finding relevant sources!',
        date: '2023-09-12'
      }
    ],
    averageRating: 9
  },
  {
    id: 'a2',
    title: 'Content Creator Companion',
    description: 'Generate ideas, outlines, and full content for blogs, social media, and more.',
    capabilities: [
      'Content ideation',
      'SEO optimization',
      'Social media scheduling',
      'Performance analytics'
    ],
    codeAccess: false,
    price: 14.99,
    category: 'marketing',
    creator: findUserById('u2'),
    isPremium: false,
    purchases: 215,
    reviews: [
      {
        userId: 'u4',
        username: 'Emily Chen',
        rating: 8,
        comment: 'Significantly improved my content strategy. The ideas it generates are creative and on-point.',
        date: '2023-08-18'
      },
      {
        userId: 'u5',
        username: 'Michael Smith',
        rating: 9,
        comment: 'Great for breaking through writer\'s block. Love the analytics feature.',
        date: '2023-10-05'
      }
    ],
    averageRating: 8.5
  },
  {
    id: 'a3',
    title: 'Code Review Assistant',
    description: 'Analyze your code for bugs, security issues, and optimization opportunities.',
    capabilities: [
      'Security vulnerability scanning',
      'Performance optimization',
      'Best practices enforcement',
      'Documentation generation'
    ],
    codeAccess: true,
    price: 29.99,
    category: 'programming',
    creator: findUserById('u3'),
    isPremium: true,
    purchases: 142,
    reviews: [
      {
        userId: 'u1',
        username: 'Jamie Smith',
        rating: 10,
        comment: 'Found critical security issues in our codebase that had been overlooked for months. Worth every penny!',
        date: '2023-07-14'
      }
    ],
    averageRating: 10
  },
  {
    id: 'a4',
    title: 'Financial Analyst',
    description: 'Personal finance management and investment analysis bot.',
    capabilities: [
      'Budget optimization',
      'Investment opportunity analysis',
      'Expense tracking',
      'Financial goal planning'
    ],
    codeAccess: false,
    price: 24.99,
    category: 'finance',
    creator: findUserById('u4'),
    isPremium: true,
    purchases: 68,
    reviews: [
      {
        userId: 'u2',
        username: 'Sarah Johnson',
        rating: 9,
        comment: 'Completely transformed how I manage my finances. The investment recommendations have been spot on.',
        date: '2023-11-02'
      }
    ],
    averageRating: 9
  },
  {
    id: 'a5',
    title: 'Health Coach AI',
    description: 'Personalized fitness and nutrition planning assistant.',
    capabilities: [
      'Workout plan generation',
      'Meal planning',
      'Progress tracking',
      'Health data analysis'
    ],
    codeAccess: false,
    price: 12.99,
    category: 'health',
    creator: findUserById('u5'),
    isPremium: false,
    purchases: 189,
    reviews: [
      {
        userId: 'u3',
        username: 'Alex Johnson',
        rating: 8,
        comment: 'The meal plans are fantastic and really helped me stay on track with my diet goals.',
        date: '2023-09-28'
      }
    ],
    averageRating: 8
  }
];

// Ensure all agents have reviews
dummyAgents.forEach(agent => {
  if (!agent.reviews || agent.reviews.length === 0) {
    // Add a default review if none exists
    agent.reviews = [
      {
        userId: 'u1',
        username: 'Jamie Smith',
        rating: 8,
        comment: 'Really useful agent, exactly what I needed!',
        date: '2023-08-15'
      }
    ];
    agent.averageRating = 8;
  }
  
  // Calculate average rating
  if (agent.reviews.length > 0) {
    const sum = agent.reviews.reduce((total, review) => total + review.rating, 0);
    agent.averageRating = sum / agent.reviews.length;
  } else {
    agent.averageRating = 0;
  }
});

export const findAgentById = (id: string): Agent | undefined => {
  return dummyAgents.find(agent => agent.id === id);
};

export const getAgentsByCreator = (userId: string): Agent[] => {
  return dummyAgents.filter(agent => agent.creator.id === userId);
};
