import type { GenerateInput } from "./ai-features";

/**
 * Deterministic fallback content used when Demonstration Mode is on or the
 * AI service is unavailable. Always tagged in the UI with the demo badge.
 */
export function buildDemoOutput(input: GenerateInput): string {
  if (input.feature === "email") {
    const { audience, audienceOther, tone, purpose, context, outcome } = input.data;
    const who = audience === "Other" && audienceOther ? audienceOther : audience;
    return [
      `Subject: ${truncate(purpose, 70)}`,
      "",
      "Email Body:",
      "",
      `Dear ${who},`,
      "",
      `I hope this message finds you well. I am writing regarding ${lower(purpose)}.`,
      "",
      `For context: ${context}`,
      "",
      `**Requested next steps**`,
      `- ${outcome}`,
      `- Please confirm receipt so we can align on timing.`,
      "",
      `I have kept this note in a ${lower(tone)} register as requested. Happy to provide any further detail you need.`,
      "",
      "Kind regards,",
      "[Your name]",
      "[Your role]",
    ].join("\n");
  }

  if (input.feature === "meeting") {
    const lines = input.data.notes
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 5);
    return [
      "## Meeting Summary",
      lines.length
        ? `The notes cover ${lines.length} substantive threads, centred on ${lower(truncate(lines[0] ?? "", 90))}.`
        : "Not specified.",
      "",
      "## Key Discussion Points",
      ...(lines.length ? lines.map((l) => `- ${truncate(l, 140)}`) : ["- Not specified."]),
      "",
      "## Decisions Made",
      "- Not specified in the supplied notes (no explicit decision language detected).",
      "",
      "## Action Items",
      "- Confirmed: circulate these notes to attendees for correction.",
      "- Suggested (not confirmed): schedule a follow-up review session.",
      "",
      "## Responsible People",
      "- Not specified in the supplied notes.",
      "",
      "## Deadlines",
      "- Not specified in the supplied notes.",
    ].join("\n");
  }

  if (input.feature === "task") {
    const t = input.data.tasks;
    const urgent = t.filter((x) => x.priority === "Critical" || x.priority === "High");
    const later = t.filter((x) => x.priority !== "Critical" && x.priority !== "High");
    return [
      "## Priority Category",
      "**Urgent & Important (do now)**",
      ...(urgent.length
        ? urgent.map((x) => `- ${x.name}${x.deadline ? ` — due ${x.deadline}` : ""}`)
        : ["- None flagged."]),
      "",
      "**Important, Not Urgent (schedule)**",
      ...(later.length ? later.map((x) => `- ${x.name}`) : ["- None flagged."]),
      "",
      "## Reasoning",
      `- Ordering uses only the priorities and deadlines you entered, relative to ${input.data.today}.`,
      "- Tasks without a deadline are scheduled after dated commitments.",
      "",
      "## Recommended Order",
      ...[...urgent, ...later].map((x, i) => `${i + 1}. ${x.name}`),
      "",
      "## Suggested Daily Schedule",
      `- 09:00–10:30 — Deep work: ${t[0]?.name ?? "highest priority task"}`,
      "- 10:30–10:45 — Break",
      `- 10:45–12:15 — ${t[1]?.name ?? "Second priority task"}`,
      "- 13:00–15:00 — Remaining scheduled work and collaboration",
      "- 15:00–16:00 — Buffer for overruns and unplanned requests",
    ].join("\n");
  }

  const { topic, depth } = input.data;
  return [
    "## Overview",
    `A ${lower(depth)}-depth briefing on **${topic}**, assembled from general background knowledge only.`,
    "",
    "## Key Insights",
    "- The topic spans several sub-areas that are usually treated separately in practice.",
    "- Established consensus exists on definitions, but far less on measurement.",
    "- Practical adoption is typically limited by process and change management, not tooling.",
    "",
    "## Important Points",
    "- **Established:** the core concepts and terminology are stable and widely documented.",
    "- **Assumption:** current market or regulatory specifics may have shifted recently.",
    "",
    "## Recommendations",
    "- Validate every figure against a primary source before external use.",
    "- Scope a small pilot before committing budget.",
    "",
    "## Questions for Further Research",
    "- What current data exists for your specific region and sector?",
    "- Which internal stakeholders own the decision?",
    "- What constraints (budget, compliance, timeline) bound the options?",
  ].join("\n");
}

export function buildDemoChatReply(message: string): string {
  return [
    `Here is a demonstration response to: **${truncate(message, 120)}**`,
    "",
    "- I can help draft communications, summarise meetings, plan tasks and structure research.",
    "- Tell me the audience, tone and outcome you want and I will structure it for you.",
    "- If any context is missing, I will ask before assuming.",
    "",
    "_Please verify anything critical before sending or acting on it._",
  ].join("\n");
}

function truncate(value: string, max: number) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function lower(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}
