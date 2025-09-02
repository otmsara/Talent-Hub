export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  following: number;
  followers: number;
  isFollowing?: boolean;
  subscription?: {
    type: string;
    seats: number;
  };
};

export type Post = {
  id: string;
  name?: string;
  userId: string;
  text: string;
  images?: string[];
  video?: string;
  link?: string;
  createdAt: Date;
  agrees: number;
  disagrees: number;
  amplifiedBy: string[];
  comments: Comment[];
  isProject?: boolean;
  isAggregator?: boolean;
  aggregatorSource?: string;
  collaborators?: string[];
  contributions?: Contribution[];
  contributorsNeeded?: string[];
  status?: string;
  nextSteps?: string;
  userNextTask?: string;
};

export type Comment = {
  id: string;
  userId: string;
  text: string | { audioUrl: string };
  createdAt: Date;
  agrees: number;
  user?: User;
  replies?: Comment[];
  parentId?: string;
};

export type Contribution = {
  id: string;
  userId: string;
  type: 'pdf' | 'code' | 'video' | 'image' | 'text';
  content: string;
  createdAt: Date;
};

export const currentUser: User = {
  id: "u1",
  name: "Jamie Smith",
  username: "jamie_designs",
  avatar: "https://i.pravatar.cc/150?img=12",
  bio: "UI/UX Designer | Creating minimal interfaces that solve complex problems",
  following: 245,
  followers: 1289
};

export const users: User[] = [
  {
    id: "u1",
    name: "Jamie Smith",
    username: "jamie_designs",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "UI/UX Designer | Creating minimal interfaces that solve complex problems",
    following: 245,
    followers: 1289
  },
  {
    id: "u2",
    name: "Alex Johnson",
    username: "alex_tech",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Tech enthusiast & developer | Building the future",
    following: 421,
    followers: 5872,
    isFollowing: true
  },
  {
    id: "u3",
    name: "Sophia Chen",
    username: "sophia_codes",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Full-stack developer | Open source contributor",
    following: 183,
    followers: 4231,
    isFollowing: true
  },
  {
    id: "u4",
    name: "Marcus Green",
    username: "marcus_creates",
    avatar: "https://i.pravatar.cc/150?img=53",
    bio: "Visual designer & 3D artist",
    following: 302,
    followers: 8721,
    isFollowing: false
  },
  {
    id: "u5",
    name: "Luna Park",
    username: "luna_product",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Product Manager | Creating user-centric products",
    following: 178,
    followers: 2431,
    isFollowing: true
  },
  // --- DUMMY USERS FOR NETWORK CARD ---
  {
    id: "alicejohnson",
    name: "Alice Johnson",
    username: "alicejohnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Product Designer | Passionate about user experience and accessibility.",
    following: 210,
    followers: 1800
  },
  {
    id: "michaelchen",
    name: "Michael Chen",
    username: "michaelchen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Backend Engineer | Building scalable systems and APIs.",
    following: 150,
    followers: 1200
  },
  {
    id: "priyapatel",
    name: "Priya Patel",
    username: "priyapatel",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "AI Researcher | Exploring the future of machine learning.",
    following: 300,
    followers: 2200
  },
  {
    id: "davidkim",
    name: "David Kim",
    username: "davidkim",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    bio: "Full Stack Developer | Lover of clean code and coffee.",
    following: 175,
    followers: 950
  },
  {
    id: "sofiarossi",
    name: "Sofia Rossi",
    username: "sofiarossi",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    bio: "UX/UI Designer | Creating beautiful and intuitive interfaces.",
    following: 260,
    followers: 1600
  },
  // --- DUMMY ACCOUNT: AGI Corp ---
  {
    id: "agi_corp",
    name: "AGI Corp",
    username: "agicorp",
    avatar: "https://static.vecteezy.com/system/resources/thumbnails/047/656/219/small_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg",
    bio: "Enterprise AI Solutions | Building the next generation of intelligent systems.",
    following: 99,
    followers: 12000,
    subscription: {
      type: "enterprise",
      seats: 4
    }
  }
];

export function findUserById(userId: string, contextCurrentUser?: User): User {
  if (contextCurrentUser && userId === contextCurrentUser.id) return contextCurrentUser;
  const user = users.find(u => u.id === userId);
  if (user) return user;
  // fallback: check fakeUsers if present
  if (typeof getAllUsers === "function") {
    const all = getAllUsers();
    const found = all.find(u => u.id === userId);
    if (found) return found;
  }
  throw new Error(`User not found: ${userId}`);
}

const newsAggregatorId = "news-bot";

export const newsAggregator: User = {
  id: newsAggregatorId,
  name: "Sphere News",
  username: "sphere_news",
  avatar: "https://i.pravatar.cc/150?img=11",
  bio: "Your AI-powered industry news aggregator. Bringing you the latest in tech, design, and development.",
  following: 0,
  followers: 14782,
};

users.push(newsAggregator);

export const posts: Post[] = [
  // --- FAKE POSTS FOR TRENDING TOPICS TESTING ---
  {
    id: "tp1",
    userId: "u2",
    text: "Excited to join the #AI4Good hackathon this year! Amazing projects and inspiring people.",
    createdAt: new Date(Date.now() - 1000000),
    agrees: 42,
    disagrees: 1,
    amplifiedBy: ["u3"],
    comments: [],
  },
  {
    id: "tp2",
    userId: "u3",
    text: "How can #AI4Good initiatives help address climate change? Share your thoughts!",
    createdAt: new Date(Date.now() - 2000000),
    agrees: 31,
    disagrees: 0,
    amplifiedBy: ["u2", "u5"],
    comments: [],
  },
  {
    id: "tp3",
    userId: "u4",
    text: "Just deployed my first dApp on the blockchain. #Web3 is changing the game for creators.",
    createdAt: new Date(Date.now() - 3000000),
    agrees: 27,
    disagrees: 2,
    amplifiedBy: [],
    comments: [],
  },
  {
    id: "tp4",
    userId: "u5",
    text: "Exploring decentralized identity solutions in #Web3. Anyone else working on this?",
    createdAt: new Date(Date.now() - 4000000),
    agrees: 19,
    disagrees: 0,
    amplifiedBy: ["u1"],
    comments: [],
  },
  {
    id: "tp5",
    userId: "u1",
    text: "Green tech is the future! Proud to be part of the #ClimateTech movement.",
    createdAt: new Date(Date.now() - 5000000),
    agrees: 54,
    disagrees: 3,
    amplifiedBy: ["u2", "u3"],
    comments: [],
  },
  {
    id: "tp6",
    userId: "u2",
    text: "Our startup just received funding for a new #ClimateTech project. Big things ahead!",
    createdAt: new Date(Date.now() - 6000000),
    agrees: 22,
    disagrees: 1,
    amplifiedBy: [],
    comments: [],
  },
  {
    id: "tp7",
    userId: "u3",
    text: "Quantum computing breakthroughs are coming fast. #QuantumLeap in progress!",
    createdAt: new Date(Date.now() - 7000000),
    agrees: 37,
    disagrees: 0,
    amplifiedBy: ["u4"],
    comments: [],
  },
  {
    id: "tp8",
    userId: "u4",
    text: "Attending a seminar on #QuantumLeap technologies. The future is now.",
    createdAt: new Date(Date.now() - 8000000),
    agrees: 29,
    disagrees: 2,
    amplifiedBy: ["u5"],
    comments: [],
  },
// --- DUMMY PROJECT POSTS FOR TRENDING PROJECTS ---
  {
    id: "proj1",
    userId: "u2",
    name: "Project Atlas",
    text: "Announcing the launch of Project Atlas! Our team is building a global knowledge map for open collaboration.",
    createdAt: new Date(Date.now() - 9000000),
    agrees: 120,
    disagrees: 4,
    amplifiedBy: ["u3", "u4"],
    comments: [],
    isProject: true,
    collaborators: ["u2", "u3", "u5", "u1"],
  },
  {
    id: "proj2",
    userId: "u3",
    name: "OpenAI GPT-5",
    text: "OpenAI GPT-5 is in early research phase. We're looking for contributors to help push the boundaries of language models. If you're interested in OpenAI GPT-5, join the project!",
    createdAt: new Date(Date.now() - 10000000),
    agrees: 210,
    disagrees: 7,
    amplifiedBy: ["u2"],
    comments: [],
    isProject: true,
    collaborators: ["u3", "u2", "u4", "u1"],
  },
  {
    id: "proj3",
    userId: "u4",
    name: "Neural Canvas",
    text: "Neural Canvas: a new platform for generative art using neural networks. Join us to create the future of digital art.",
    createdAt: new Date(Date.now() - 11000000),
    agrees: 98,
    disagrees: 2,
    amplifiedBy: ["u1", "u5"],
    comments: [],
    isProject: true,
    collaborators: ["u4", "u1"],
  },
  {
    id: "proj4",
    userId: "u5",
    name: "BioGenX",
    text: "BioGenX is developing next-gen bioinformatics tools for personalized medicine. Collaboration is open!",
    createdAt: new Date(Date.now() - 12000000),
    agrees: 76,
    disagrees: 1,
    amplifiedBy: ["u2", "u3"],
    comments: [],
    isProject: true,
    collaborators: ["u5", "u3", "u2", "u4", "u1"],
  },
  {
    id: "p1",
    userId: "u2",
    text: "Just launched a new design system for our app. Check it out and let me know what you think!",
    images: ["https://picsum.photos/seed/design1/600/400"],
    link: "https://designsystem.example.com",
    createdAt: new Date(Date.now() - 3600000),
    agrees: 128,
    disagrees: 3,
    amplifiedBy: ["u3", "u5"],
    comments: [
      {
        id: "c1",
        userId: "u3",
        text: "Love the color palette you've chosen. Very accessible!",
        createdAt: new Date(Date.now() - 1800000),
        agrees: 12
      },
      {
        id: "c2",
        userId: "u5",
        text: "The typography is perfect. What font are you using?",
        createdAt: new Date(Date.now() - 900000),
        agrees: 8
      }
    ]
  },
  // Rebuilt project post for Sophia Chen
  {
    id: "p2",
    userId: "u3",
    name: "Image Optimizer",
    text: "Working on a new algorithm to optimize image loading. Initial tests show 40% faster load times! 🚀",
    createdAt: new Date(Date.now() - 7200000),
    agrees: 245,
    disagrees: 2,
    amplifiedBy: ["u2", "u4"],
    comments: [
      {
        id: "c3",
        userId: "u2",
        text: "This is going to be game-changing for our mobile users!",
        createdAt: new Date(Date.now() - 5400000),
        agrees: 18
      }
    ],
    isProject: true,
    collaborators: ["u2", "u5"],
    contributions: [
      {
        id: "con1",
        userId: "u5",
        type: "code",
        content: "https://github.com/example/image-optimization",
        createdAt: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    id: "p3",
    userId: "u5",
    text: "User research revealed some interesting insights about our onboarding flow. Planning to implement changes next week.",
    createdAt: new Date(Date.now() - 10800000),
    agrees: 67,
    disagrees: 5,
    amplifiedBy: [],
    comments: [
      {
        id: "c4",
        userId: "u1",
        text: "Would love to hear more about your findings! Any key pain points?",
        createdAt: new Date(Date.now() - 9000000),
        agrees: 11
      }
    ]
  },
  // Rebuilt project post for Marcus Green
  {
    id: "p4",
    userId: "u4",
    name: "Sustainable 3D VR",
    text: "Created a 3D visualization for sustainable architecture. Fully interactive and ready for VR exploration.",
    images: ["https://picsum.photos/seed/arch1/600/400", "https://picsum.photos/seed/arch2/600/400"],
    video: "https://example.com/video.mp4",
    createdAt: new Date(Date.now() - 86400000),
    agrees: 532,
    disagrees: 7,
    amplifiedBy: ["u1", "u2", "u3", "u5"],
    comments: [
      {
        id: "c5",
        userId: "u1",
        text: "The attention to detail is incredible! Would love to try this in VR.",
        createdAt: new Date(Date.now() - 82800000),
        agrees: 22
      },
      {
        id: "c6",
        userId: "u2",
        text: "How did you handle the VR rendering pipeline?",
        createdAt: new Date(Date.now() - 80000000),
        agrees: 7
      }
    ],
    isProject: true,
    collaborators: ["u1", "u3"],
    contributions: [
      {
        id: "con2",
        userId: "u3",
        type: "text",
        content: "Added energy efficiency calculations for the north wing.",
        createdAt: new Date(Date.now() - 43200000)
      },
      {
        id: "con3",
        userId: "u1",
        type: "image",
        content: "https://picsum.photos/seed/arch3/600/400",
        createdAt: new Date(Date.now() - 21600000)
      }
    ],
    status: "In progress: 3D model completed, VR integration in review.",
    nextSteps: "Test VR experience on multiple devices, gather feedback from collaborators, and prepare for public demo.",
    userNextTask: "Review the VR rendering pipeline and submit feedback by Friday."
  },
  {
    id: "p5",
    userId: "u1",
    text: "Just finished redesigning my portfolio. Aiming for simplicity and clarity. Feedback welcome!",
    images: ["https://picsum.photos/seed/portfolio/600/400"],
    link: "https://portfolio.example.com",
    createdAt: new Date(Date.now() - 7200000),
    agrees: 48,
    disagrees: 0,
    amplifiedBy: ["u2"],
    comments: [
      {
        id: "c6",
        userId: "u2",
        text: "Clean and elegant! Love the transitions between sections.",
        createdAt: new Date(Date.now() - 5400000),
        agrees: 8
      }
    ]
  },
  {
    id: "agg1",
    userId: newsAggregatorId,
    text: "🔥 BREAKING: A new web standard for browser APIs was announced today, promising to revolutionize how developers interact with hardware peripherals. The W3C's new proposal aims to simplify access to device features.",
    link: "https://example.com/web-standard-announcement",
    createdAt: new Date(Date.now() - 2700000),
    agrees: 327,
    disagrees: 12,
    amplifiedBy: ["u2", "u3"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Web Standards Weekly"
  },
  {
    id: "agg2",
    userId: newsAggregatorId,
    text: "📊 TREND ALERT: Zero-knowledge proofs are gaining traction in mainstream applications. Companies are increasingly adopting this cryptographic method to enhance privacy while maintaining data verification capabilities.",
    images: ["https://picsum.photos/seed/zk-proofs/600/400"],
    createdAt: new Date(Date.now() - 10800000),
    agrees: 476,
    disagrees: 8,
    amplifiedBy: ["u3", "u4", "u5"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Crypto Insider"
  },
  {
    id: "agg3",
    userId: newsAggregatorId,
    text: "💡 NEW RESEARCH: MIT researchers have developed a neural network architecture that reduces training time by 60% while maintaining accuracy parity with conventional models. The technique uses sparse matrix operations to optimize computations.",
    link: "https://example.com/mit-neural-network-breakthrough",
    createdAt: new Date(Date.now() - 86400000),
    agrees: 892,
    disagrees: 14,
    amplifiedBy: ["u2", "u4"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "AI Research Today"
  },
  {
    id: "agg4",
    userId: newsAggregatorId,
    text: "🚀 PRODUCT LAUNCH: GraphQL Galaxy, a new developer platform, has launched with features specifically tailored for complex data fetching scenarios. The platform includes visual query building and automated documentation.",
    images: ["https://picsum.photos/seed/graphql-galaxy/600/400"],
    createdAt: new Date(Date.now() - 172800000),
    agrees: 543,
    disagrees: 27,
    amplifiedBy: ["u2", "u3", "u5"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "DevTools Digest"
  },
  {
    id: "agg5",
    userId: newsAggregatorId,
    text: "📱 INDUSTRY SHIFT: Progressive Web Apps (PWAs) are seeing wider adoption among enterprise customers, with a 47% increase in deployment over the last quarter. Performance metrics show 3x improvement in load times compared to traditional web apps.",
    link: "https://example.com/pwa-enterprise-adoption",
    createdAt: new Date(Date.now() - 259200000),
    agrees: 631,
    disagrees: 42,
    amplifiedBy: ["u3"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Enterprise Tech Weekly"
  }
];

export const projects = () => posts.filter(post => post.isProject);

export const generateFeed = () => {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  
  return date.toLocaleDateString();
};

export const generateFakeUsers = (): User[] => {
  const fakeUsers: User[] = [];

  const firstNames = [
    "John", "Jane", "David", "Sarah", "Michael", "Emily", "Robert", "Emma", "James", "Olivia",
    "William", "Sophia", "Joseph", "Isabella", "Charles", "Mia", "Thomas", "Charlotte", "Daniel", "Amelia",
    "Matthew", "Harper", "Anthony", "Evelyn", "Donald", "Abigail", "Steven", "Elizabeth", "Paul", "Sofia",
    "Andrew", "Avery", "Joshua", "Ella", "Kenneth", "Scarlett", "Kevin", "Grace", "Brian", "Chloe",
    "George", "Victoria", "Edward", "Riley", "Ronald", "Aria", "Timothy", "Lily", "Jason", "Aubrey"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"
  ];

  const bioFragments = [
    "Designer", "Developer", "Product Manager", "UX Researcher", "AI Specialist", "Data Scientist",
    "Frontend Engineer", "Backend Engineer", "Full-Stack Developer", "DevOps Engineer", "UI Designer",
    "Entrepreneur", "Startup Founder", "Project Manager", "Consultant", "Marketer", "Content Creator",
    "Blockchain Developer", "Cloud Engineer", "Systems Architect", "Mobile Developer", "Game Developer"
  ];

  const bioAttributes = [
    "passionate about", "focused on", "specialized in", "excited about", "exploring", "innovating in",
    "researching", "building in", "transforming", "revolutionizing", "streamlining", "optimizing"
  ];

  const bioTopics = [
    "user experience", "web development", "machine learning", "data visualization", "blockchain",
    "cloud computing", "mobile applications", "AI", "open source", "product design", "user interfaces",
    "microservices", "serverless architecture", "augmented reality", "virtual reality", "IoT",
    "cybersecurity", "digital transformation", "automation", "digital marketing", "content strategy"
  ];

  for (let i = 0; i < 10000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
    
    const role = bioFragments[Math.floor(Math.random() * bioFragments.length)];
    const action = bioAttributes[Math.floor(Math.random() * bioAttributes.length)];
    const topic = bioTopics[Math.floor(Math.random() * bioTopics.length)];
    
    const bio = `${role} ${action} ${topic} | Building the future of technology`;
    
    const avatarSeed = Math.floor(Math.random() * 1000);
    const avatar = `https://i.pravatar.cc/150?img=${avatarSeed % 70}`;
    
    const followers = Math.floor(Math.random() * 5000);
    const following = Math.floor(Math.random() * 1000);
    
    fakeUsers.push({
      id: `fake${i}`,
      name,
      username,
      avatar,
      bio,
      followers,
      following,
      isFollowing: Math.random() > 0.7
    });
  }
  
  return fakeUsers;
};

export const fakeUsers = generateFakeUsers();

export const getAllUsers = (): User[] => {
  return [...users, ...fakeUsers];
};
