import {
  LayoutDashboard,
  Home,
  LogIn,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  title: string;
  subtitle: string;
  short: string;
  icon: LucideIcon;
};

export const HOME_ITEM: NavItem = {
  to: "/",
  label: "Home",
  title: "AI Workplace Productivity Assistant",
  subtitle: "Enterprise AI assistants with responsible-AI guardrails",
  short: "Overview of the workspace and its assistants.",
  icon: Home,
};

export const AUTH_ITEM: NavItem = {
  to: "/auth",
  label: "Sign in",
  title: "Workspace access",
  subtitle: "Sign in or create an account to open the assistants",
  short: "Account creation, sign-in and session management.",
  icon: LogIn,
};

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    title: "Dashboard",
    subtitle: "Your workplace productivity command centre",
    short: "Overview of every assistant and your recent activity.",
    icon: LayoutDashboard,
  },
  {
    to: "/email",
    label: "Smart Email Generator",
    title: "Smart Email Generator",
    subtitle: "Draft precise, on-tone workplace emails",
    short: "Turn purpose, context and outcome into a ready-to-send email.",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Meeting Notes Summarizer",
    title: "Meeting Notes Summarizer",
    subtitle: "Structured minutes from raw notes",
    short: "Extract decisions, owners and deadlines from messy notes.",
    icon: FileText,
  },
  {
    to: "/tasks",
    label: "AI Task Planner",
    title: "AI Task Planner",
    subtitle: "Eisenhower prioritisation and a realistic day plan",
    short: "Prioritise your workload and get a schedule you can keep.",
    icon: ListChecks,
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    title: "AI Research Assistant",
    subtitle: "Briefings that separate fact from assumption",
    short: "Synthesise any topic into an actionable briefing.",
    icon: Search,
  },
  {
    to: "/chat",
    label: "AI Workplace Chatbot",
    title: "AI Workplace Chatbot",
    subtitle: "Conversational help with session memory",
    short: "Ask anything about your work day, with context retained.",
    icon: MessageSquare,
  },
  {
    to: "/about",
    label: "About / Responsible AI",
    title: "About / Responsible AI",
    subtitle: "Architecture, prompt design and safety protocols",
    short: "How this assistant is built and governed.",
    icon: ShieldCheck,
  },
];

export const FEATURE_NAV = NAV_ITEMS.filter(
  (item) => item.to !== "/dashboard" && item.to !== "/about",
);

export const PUBLIC_NAV: NavItem[] = [HOME_ITEM, NAV_ITEMS[NAV_ITEMS.length - 1]!, AUTH_ITEM];

const ALL_ITEMS = [HOME_ITEM, AUTH_ITEM, ...NAV_ITEMS];

export function navForPath(pathname: string): NavItem {
  const exact = ALL_ITEMS.find((item) => item.to === pathname);
  if (exact) return exact;
  const nested = ALL_ITEMS.find((item) => item.to !== "/" && pathname.startsWith(item.to));
  return nested ?? HOME_ITEM;
}
