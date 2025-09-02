
import { User, findUserById } from './dummyData';

export interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  price: number;
  category: string;
  creator: User;
  isPremium: boolean;
  purchases: number;
  reviews: Review[];
  averageRating: number;
}

export const dummyPrompts: Prompt[] = [
  {
    id: 'p1',
    title: 'Professional Email Writer',
    description: 'Generate professional emails for any business situation.',
    content: `As a professional email writer, your task is to compose clear, concise, and professional emails for various business situations.

1. Ask for the email purpose (follow-up, introduction, request, etc.)
2. Inquire about the relationship with the recipient
3. Request any key points to include
4. Generate a professional email with:
   - Appropriate greeting
   - Clear and concise body
   - Professional closing
   - Optional follow-up suggestion
5. Offer alternative tones (formal, friendly, urgent) if requested`,
    price: 2.99,
    category: 'business',
    creator: findUserById('u2'),
    isPremium: false,
    purchases: 172,
    reviews: [
      {
        userId: 'u3',
        username: 'Alex Johnson',
        rating: 9,
        comment: 'Saved me so much time writing emails to clients. Highly recommended!',
        date: '2023-06-12'
      }
    ],
    averageRating: 9
  },
  {
    id: 'p2',
    title: 'Code Reviewer',
    description: 'Expert code review with best practices and security insights.',
    content: `As a Code Reviewer, your task is to review code snippets and provide expert feedback.

1. Analyze the code for:
   - Readability and maintainability
   - Potential bugs or errors
   - Security vulnerabilities
   - Performance issues
   - Adherence to best practices
2. Provide specific line-by-line comments
3. Suggest improvements and refactoring options
4. Rate the code quality on a scale of 1-10
5. Summarize the main findings and recommendations`,
    price: 5.99,
    category: 'programming',
    creator: findUserById('u3'),
    isPremium: true,
    purchases: 89,
    reviews: [
      {
        userId: 'u4',
        username: 'Emily Chen',
        rating: 8,
        comment: 'Really thorough code analysis. Found issues I completely missed.',
        date: '2023-07-22'
      },
      {
        userId: 'u5',
        username: 'Michael Smith',
        rating: 7,
        comment: 'Good suggestions but could be more detailed for complex codebases.',
        date: '2023-08-05'
      }
    ],
    averageRating: 7.5
  },
  {
    id: 'p3',
    title: 'Social Media Content Planner',
    description: 'Generate a full month of engaging social media content.',
    content: `As a Social Media Content Planner, help create a comprehensive content plan.

1. Request the following information:
   - Target audience demographics
   - Platform(s) (Instagram, Twitter, LinkedIn, etc.)
   - Industry/niche
   - Brand voice (casual, professional, humorous, etc.)
   - Key goals (engagement, traffic, sales, etc.)
2. Generate a 30-day content calendar with:
   - Post ideas with suggested copy
   - Content themes for each week
   - Optimal posting times
   - Hashtag suggestions
   - Engagement prompts
3. Include a mix of content types (educational, promotional, user-generated, etc.)`,
    price: 9.99,
    category: 'marketing',
    creator: findUserById('u4'),
    isPremium: true,
    purchases: 205,
    reviews: [
      {
        userId: 'u1',
        username: 'Jamie Smith',
        rating: 9,
        comment: 'Transformed our social media strategy completely. Great value!',
        date: '2023-09-15'
      }
    ],
    averageRating: 9
  },
  {
    id: 'p4',
    title: 'Resume Optimizer',
    description: 'Transform your resume to highlight key skills and achievements.',
    content: `As a Resume Optimizer, help transform resumes to be ATS-friendly and impactful.

1. Review the current resume and job description
2. Identify keywords from the job description
3. Restructure the resume to:
   - Include relevant keywords naturally
   - Highlight quantifiable achievements
   - Remove irrelevant information
   - Use action verbs and concise language
4. Suggest improvements for formatting and layout
5. Provide a final version optimized for both ATS systems and human readers`,
    price: 3.99,
    category: 'career',
    creator: findUserById('u5'),
    isPremium: false,
    purchases: 328,
    reviews: [
      {
        userId: 'u2',
        username: 'Alex Johnson', 
        rating: 8,
        comment: 'Helped me land three interviews in a week after months of searching!',
        date: '2023-08-22'
      }
    ],
    averageRating: 8
  },
  {
    id: 'p5',
    title: 'Creative Story Prompt',
    description: 'Generate compelling short story ideas and character outlines.',
    content: `As a Creative Story Prompter, help writers develop engaging fiction.

1. Ask for preferences:
   - Genre (fantasy, sci-fi, romance, mystery, etc.)
   - Length (flash fiction, short story, novel)
   - Target audience
   - Themes or elements to include/avoid
2. Generate a comprehensive story prompt with:
   - Intriguing premise
   - Main character outline with motivations
   - Supporting character ideas
   - Setting description
   - Potential plot points and conflicts
   - Suggested ending types (twist, resolution, cliffhanger)
3. Provide additional variations or expansions if requested`,
    price: 1.99,
    category: 'creativity',
    creator: findUserById('u2'),
    isPremium: false,
    purchases: 143,
    reviews: [
      {
        userId: 'u3',
        username: 'Sophia Chen',
        rating: 10,
        comment: 'My creative writing students love these prompts. Highly recommended!',
        date: '2023-07-18'
      }
    ],
    averageRating: 10
  },
  {
    id: 'p6',
    title: 'Data Analysis Plan',
    description: 'Develop a structured approach to analyze any dataset.',
    content: `As a Data Analysis Planner, create a comprehensive plan for data analysis.

1. Request information about:
   - Dataset characteristics (size, variables, format)
   - Research questions or business goals
   - Available tools and user expertise
2. Develop a structured analysis plan:
   - Data cleaning and preprocessing steps
   - Exploratory data analysis techniques
   - Statistical methods appropriate for the data
   - Visualization recommendations
   - Interpretation guidance
3. Include code snippets if appropriate (Python/R)
4. Suggest validation methods and potential pitfalls
5. Provide reporting template recommendations`,
    price: 12.99,
    category: 'data science',
    creator: findUserById('u3'),
    isPremium: true,
    purchases: 67,
    reviews: [
      {
        userId: 'u4',
        username: 'Emily Chen',
        rating: 9,
        comment: 'Extremely thorough and well-structured. Helped our team standardize our approach.',
        date: '2023-10-05'
      }
    ],
    averageRating: 9
  }
];

// Ensure all prompts have reviews
dummyPrompts.forEach(prompt => {
  if (!prompt.reviews || prompt.reviews.length === 0) {
    // Add a default review if none exists
    prompt.reviews = [
      {
        userId: 'u1',
        username: 'Jamie Smith',
        rating: 8,
        comment: 'Really useful prompt, exactly what I needed!',
        date: '2023-08-15'
      }
    ];
    prompt.averageRating = 8;
  }
  
  // Calculate average rating
  if (prompt.reviews.length > 0) {
    const sum = prompt.reviews.reduce((total, review) => total + review.rating, 0);
    prompt.averageRating = sum / prompt.reviews.length;
  } else {
    prompt.averageRating = 0;
  }
});

export const findPromptById = (id: string): Prompt | undefined => {
  return dummyPrompts.find(prompt => prompt.id === id);
};

export const getPromptsByCreator = (userId: string): Prompt[] => {
  return dummyPrompts.filter(prompt => prompt.creator.id === userId);
};
