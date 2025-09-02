import {
  Network,
  Linkedin,
  ClipboardList,
  Send,
  UserCheck,
  Scale,
  TrendingUp,
  DollarSign,
  RefreshCcw,
  Star,
} from "lucide-react";

export type SocialsType = {
  name: string;
  link: string;
  icon: string;
};

export const SOCIALS = [
  {
    name: "LINKEDIN_URL",
    link: "https://www.linkedin.com/showcase/arya-super-engine-agent/",
    icon: "lucide:linkedin",
  },
  {
    name: "TWITTER_URL",
    link: "https://x.com/IamAryaAI",
    icon: "ri:twitter-x-fill",
  },
  {
    name: "WHATSAPP_URL",
    link: "https://t.me/+bIMzsHwOwaxhM2U8",
    icon: "hugeicons-telegram",
  },
];

export const categorizedPrompts = [
  {
    id: 0,
    category: "Laying the Groundwork",
    icon: Network,
    prompts: [
      "Based on my current skills and experience, what internal opportunities should I explore within my current organization?",
      "How can I effectively network within my company to discover hidden job openings?",
      "Can you help me create a targeted list of 3-5 dream companies, and suggest how to research and approach them?",
      "What strategies should I use to build meaningful relationships with managers at my target companies even if no roles are posted?",
      "How can I leverage my existing network to uncover unlisted job opportunities?",
      "What specific steps should I take to ensure my job search is focused and strategic, avoiding the 'spray and pray' approach?",
      "How can I stand out in a job search when facing the challenges of a white-collar recession and a flooded job market?",
      "Can you suggest a way for me to research the work culture and leadership of my dream companies to ensure alignment with my values?",
      "What role should referrals play in my job search strategy, and how can I secure them effectively?",
      "How do I create a strategy to cold reach out to key decision-makers at companies, even if no role is advertised?",
    ],
  },
  {
    id: 1,
    category: "Optimizing LinkedIn",
    icon: Linkedin,

    prompts: [
      "How can I stay active on LinkedIn to increase my visibility and engagement with potential employers?",
      "What specific actions should I take to make sure my LinkedIn profile is appealing to recruiters and hiring managers?",
      "How can I strategically follow my dream companies on LinkedIn to stay informed about job opportunities?",
      "What are some tips to improve my LinkedIn 'About' section to make it more compelling for recruiters?",
      "How can I enhance my LinkedIn profile with professional visuals to stand out in a competitive job market?",
      "Should I use the #OpenToWork banner on my LinkedIn profile, and if so, how can I make the most of it?",
      "What are the best ways to use LinkedIn Premium to network more effectively?",
      "How do I reach out to recruiters and managers on LinkedIn to establish a professional connection?",
      "How can I optimize my LinkedIn for remote job opportunities, considering my experience?",
      "Can you give me some ideas on what to post and comment on LinkedIn to stay visible and show my professional engagement?",
    ],
  },
  {
    id: 2,
    category: "Crafting a Winning Résumé",
    icon: ClipboardList,

    prompts: [
      "Can you help me tailor my résumé to highlight my top skills and experience for a specific job role?",
      "What are the best ways to highlight my individual contributions on my résumé, especially if I have worked on teams?",
      "How can I showcase my experience with remote work on my résumé to appeal to WFH roles?",
      "Can you help me optimize my résumé to match the job descriptions I am applying for?",
      "What are the most important keywords I should include in my résumé to make it more likely to be seen by recruiters?",
      "How can I ensure my résumé stands out without resorting to tricks like white fonting?",
      "Should I consider hiring a professional résumé writer, and what should I look for when selecting one?",
      "How can I adapt my résumé to reflect my growth and readiness for higher-level roles, even if I am applying for entry-level positions?",
      "What are some tips for highlighting accomplishments in a way that’s specific and measurable?",
      "Should I use a one-page résumé format, or is it okay to extend it to two pages for my level of experience?",
    ],
  },
  {
    id: 3,
    category: "Applying Effectively",
    icon: Send,

    prompts: [
      "How can I make sure I apply early enough to increase my chances of getting noticed?",
      "What’s the best way to message recruiters or hiring managers directly to stand out after applying?",
      "How do I effectively secure a referral when applying for a role?",
      "What are the pros and cons of applying cold to companies without an open job listing?",
      "How can I propose my own role to a company, even if they don’t have an opening that fits my skills?",
      "How can I create a job alert system to stay ahead of new opportunities that match my profile?",
      "What’s the best way to follow up after applying, and how soon should I reach out to ensure I stay top of mind?",
      "Can you help me craft a compelling message for a recruiter or hiring manager when I’ve applied to a role?",
      "How should I balance applying for multiple jobs versus focusing on a select few opportunities?",
      "What can I do to ensure my application is not overlooked in the flood of job seekers?",
    ],
  },
  {
    id: 4,
    category: "Acing Interviews",
    icon: UserCheck,

    prompts: [
      "How can I prepare for interviews in a way that sets me apart from other candidates?",
      "What’s the best way to practice interview questions when I have limited real interview experience?",
      "Can you help me prepare for behavioral interview questions using the STAR method?",
      "What’s the best way to demonstrate my knowledge about the company during an interview?",
      "How can I handle tough questions about gaps in my employment or lack of experience?",
      "What are some strategic ways to talk about my achievements in interviews, especially for junior roles?",
      "How can I handle rejection gracefully and maintain connections for future opportunities?",
      "How can I use AI tools like ChatGPT to practice and improve my interview answers?",
      "What’s the best way to make a lasting impression during a virtual interview?",
      "How do I send thank-you notes after interviews in a way that strengthens my candidacy?",
    ],
  },
  {
    id: 5,
    category: "Maintaining Balance",
    icon: Scale,

    prompts: [
      "How can I stay organized while managing multiple job applications and networking efforts?",
      "What strategies can I use to manage job search burnout and maintain motivation?",
      "Can you help me set up a tracking system for my job applications to ensure I follow up on time?",
      "How can I build a support group of peers who understand the challenges of job searching?",
      "What steps can I take to prevent burnout while maintaining a high level of job search activity?",
      "How should I manage rejections emotionally and use them as learning opportunities?",
      "What’s the best way to stay focused on my job search while avoiding overwhelm?",
      "How can I build resilience in the face of job search challenges and keep moving forward?",
      "What are some healthy habits I can adopt to stay motivated during my job search?",
      "How can I create a job search schedule that allows me to be productive while also taking necessary breaks?",
    ],
  },
  {
    id: 6,
    category: "Planning for Long-Term Success",
    icon: TrendingUp,

    prompts: [
      "How can I continue to network even after I land my next job?",
      "What’s the best way to approach networking as a long-term strategy for career growth?",
      "How can I set up a system to meet new people and expand my professional network every month?",
      "What steps should I take to keep learning and developing professionally even after landing a role?",
      "How can I balance job searching with the goal of building long-term career success?",
      "What are the key milestones I should aim for in the first few years of my career?",
      "How can I use LinkedIn to stay connected with former colleagues and other professionals?",
      "How can I make sure I’m ready for a future job search by keeping my resume and network updated?",
      "What strategies should I use to ensure that my next job is a stepping stone to bigger opportunities?",
      "How can I continuously adapt and grow my skills to stay relevant in a constantly changing job market?",
    ],
  },
  {
    id: 7,
    category: "Salary & Compensation Strategy",
    icon: DollarSign,

    prompts: [
      "How can I determine the fair salary for my role, given my experience and location?",
      "What are some tips for negotiating salary early in my career?",
      "How should I approach salary discussions during the job application process?",
      "What factors should I consider when evaluating job offers beyond salary?",
      "How can I secure a raise or promotion within my current role?",
      "What’s the best way to prepare for salary negotiations when I have little experience?",
      "How can I gather market data to support my salary expectations during an offer?",
      "What strategies can I use to ask for more benefits or perks during salary negotiations?",
      "How can I be transparent about my salary expectations while avoiding undervaluing myself?",
      "What are some tips for negotiating a salary increase or promotion within my current company?",
    ],
  },
  {
    id: 8,
    icon: RefreshCcw,

    category: "Career Transitions",
    prompts: [
      "What steps can I take to pivot to a new industry or role without starting from scratch?",
      "How can I use transferable skills to transition into a completely new career?",
      "What are the most effective ways to position myself as an attractive candidate for a career switch?",
      "How can I gain relevant experience for a new field when my background is in a different industry?",
      "What resources should I tap into to learn more about a new career path before making the switch?",
      "How can I identify industries that are hiring and align with my long-term career interests?",
      "Can you help me create a roadmap for successfully transitioning into a new job or field?",
      "How do I leverage my network to successfully transition into a new career?",
      "What steps can I take to build a personal brand that supports a career change?",
      "How can I adapt my résumé and LinkedIn profile for a career transition?",
    ],
  },
  {
    id: 9,
    category: "Building Professional Reputation",
    icon: Star,

    prompts: [
      "How can I establish myself as an expert in my field early in my career?",
      "What steps can I take to get more visibility in my industry and establish my personal brand?",
      "How can I use public speaking or writing to build my reputation as a thought leader?",
      "What strategies should I employ to maintain a professional online presence that attracts opportunities?",
      "How can I increase my influence within my organization or industry?",
      "What are the best ways to build my personal brand online without being overly self-promotional?",
      "How can I balance work performance with actively promoting my skills and achievements?",
      "What are the most effective ways to network at industry events to build my reputation?",
      "How can I proactively reach out to influencers and thought leaders to expand my professional network?",
      "What steps can I take to cultivate mentorship relationships that will guide my career development?",
    ],
  },
];
