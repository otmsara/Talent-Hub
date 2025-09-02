import { Briefcase, Goal, LucideIcon } from "lucide-react";

// Import specific Lucide icons
import { LayoutDashboard, Bot, Bell, Settings, Wrench } from "lucide-react";
import { FlaskConical } from "lucide-react";

export type LinksType = {
  name: string;
  link?: string;
  Icon: LucideIcon;
  label?: string;
};

// Define the section links with Lucide icons
export const sectionLinks: LinksType[] = [
  {
    name: "Dashboard",
    link: "/dashboard",
    Icon: LayoutDashboard,
    label: "soon",
  },
  {
    name: "AI Career Insights",
    link: "/ai-career-insights",
    Icon: Bot,
  },
  {
    name: "Career Workspace",
    link: "",
    Icon: Briefcase,
  },
  {
    name: "Career Goals",
    link: "/career-goals",
    Icon: Goal,
    label: "soon",
  },
  {
    name: "Notifications",
    link: "/notifications",
    Icon: Bell,
    label: "soon",
  },
  {
    name: "Real-Time Resume",
    link: "/resume-builder",
    Icon: Wrench,
    label: "soon",
  },
  {
    name: "Settings & Feedback",
    link: "/settings",
    Icon: Settings,
    label: "soon",
  },
  {
    name: "Qolabs",
    link: "/qolabs",
    Icon: FlaskConical,
    label: "new",
  },
];
