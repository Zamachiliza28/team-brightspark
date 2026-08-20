import {
  LayoutDashboard,
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

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
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
  (item) => item.to !== "/" && item.to !== "/about",
);

export function navForPath(pathname: string): NavItem {
  const exact = NAV_ITEMS.find((item) => item.to === pathname);
  if (exact) return exact;
  const nested = NAV_ITEMS.find((item) => item.to !== "/" && pathname.startsWith(item.to));
  return nested ?? NAV_ITEMS[0]!;
}
