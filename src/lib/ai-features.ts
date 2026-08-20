import { z } from "zod";

/**
 * Shared, client-safe feature contracts for the AI tools.
 * Prompt assembly happens server-side in `ai.server.ts`.
 */

export const emailInputSchema = z.object({
  audience: z.string().min(1),
  audienceOther: z.string().optional().default(""),
  tone: z.string().min(1),
  purpose: z.string().min(1),
  context: z.string().min(1),
  outcome: z.string().min(1),
});

export const meetingInputSchema = z.object({
  notes: z.string().min(1),
});

export const taskItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  deadline: z.string().optional().default(""),
  priority: z.string().min(1),
});

export const taskInputSchema = z.object({
  today: z.string().min(1),
  workingHours: z.string().optional().default(""),
  tasks: z.array(taskItemSchema).min(1),
});

export const researchInputSchema = z.object({
  topic: z.string().min(1),
  depth: z.string().min(1),
});

export const generateInputSchema = z.discriminatedUnion("feature", [
  z.object({ feature: z.literal("email"), data: emailInputSchema }),
  z.object({ feature: z.literal("meeting"), data: meetingInputSchema }),
  z.object({ feature: z.literal("task"), data: taskInputSchema }),
  z.object({ feature: z.literal("research"), data: researchInputSchema }),
]);

export type EmailInput = z.infer<typeof emailInputSchema>;
export type MeetingInput = z.infer<typeof meetingInputSchema>;
export type TaskItem = z.infer<typeof taskItemSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type ResearchInput = z.infer<typeof researchInputSchema>;
export type GenerateInput = z.infer<typeof generateInputSchema>;
export type FeatureId = GenerateInput["feature"];

export const AUDIENCES = ["Client", "Manager", "Team", "Colleague", "Other"] as const;
export const TONES = ["Formal", "Professional", "Friendly", "Persuasive"] as const;
export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export const DEPTHS = ["Simple", "Intermediate", "Detailed"] as const;

export const GLOBAL_DISCLAIMER = "AI-generated content may require human review.";
export const OUTPUT_REMINDER =
  "Please review and verify this AI-generated content before use.";
export const DEMO_BADGE = "Demo Output – AI Service Unavailable";

/** Structured prompt architecture, surfaced verbatim on the About page. */
export const PROMPT_ARCHITECTURE: Record<
  FeatureId | "chat",
  { label: string; role: string; task: string; constraints: string[]; format: string }
> = {
  email: {
    label: "Smart Email Generator",
    role: "Workplace Communication Assistant",
    task: "Generate a professional email using ONLY the information provided by the user.",
    constraints: [
      "Never invent facts, names, numbers, dates or context that the user did not supply.",
      "Match the requested tone exactly and keep it consistent throughout.",
      "Make any action steps or requests explicit and unambiguous.",
      "If critical information is missing, insert a clearly marked [placeholder] instead of guessing.",
    ],
    format: 'Return strictly two labelled sections: "Subject:" then "Email Body:".',
  },
  meeting: {
    label: "Meeting Notes Summarizer",
    role: "Meeting Documentation Specialist",
    task: "Extract the key insights from raw meeting notes into a concise, structured summary.",
    constraints: [
      "Rely strictly on the provided text; do not invent decisions, deadlines or assignees.",
      "Clearly distinguish confirmed actions from suggestions or open ideas.",
      'Write "Not specified" where the notes contain no information for a section.',
      "Preserve the original wording of commitments where accuracy matters.",
    ],
    format:
      "Sections in order: Meeting Summary, Key Discussion Points, Decisions Made, Action Items, Responsible People, Deadlines.",
  },
  task: {
    label: "AI Task Planner",
    role: "Workplace Productivity Specialist",
    task: "Prioritise the supplied tasks into an Eisenhower-style matrix and construct a realistic schedule.",
    constraints: [
      "Never hallucinate dates; use only the deadlines given and the supplied current date.",
      "Give explicit reasoning for the recommended order.",
      "Respect realistic workload limits and include buffer time and breaks.",
      "Flag conflicting or impossible deadlines rather than silently reordering them.",
    ],
    format:
      "Sections in order: Priority Category (Eisenhower matrix), Reasoning, Recommended Order, Suggested Daily Schedule.",
  },
  research: {
    label: "AI Research Assistant",
    role: "Research Analyst",
    task: "Synthesise the topic into a clear, actionable briefing at the requested depth.",
    constraints: [
      "Separate well-established facts from assumptions and inference.",
      "Explicitly highlight uncertainties that require independent verification.",
      "Do not fabricate statistics, citations, sources or quotations.",
      "State plainly when a topic requires current data you cannot confirm.",
    ],
    format:
      "Sections in order: Overview, Key Insights, Important Points, Recommendations, Questions for Further Research.",
  },
  chat: {
    label: "AI Workplace Chatbot",
    role: "AI Workplace Productivity Assistant",
    task: "Help the user with workplace communication, planning, summarisation and research questions.",
    constraints: [
      "Stay concise and professional; prefer short paragraphs and bullet points.",
      "Ask a clarifying question when essential context is missing instead of assuming.",
      "Remind the user to verify AI output on critical or externally-facing tasks.",
      "Never invent company facts, policies, names or figures.",
    ],
    format: "Conversational markdown, structured with headings or bullets when helpful.",
  },
};
