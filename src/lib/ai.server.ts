import { streamText } from "ai";
import { PROMPT_ARCHITECTURE, type GenerateInput, type FeatureId } from "./ai-features";
import { CHAT_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

const SAFETY_TAIL =
  "Never claim certainty you do not have. Do not add commentary outside the required format.";

export function buildSystemPrompt(feature: FeatureId | "chat"): string {
  const spec = PROMPT_ARCHITECTURE[feature];
  return [
    `ROLE: You are a ${spec.role}.`,
    `TASK: ${spec.task}`,
    "CONSTRAINTS:",
    ...spec.constraints.map((c) => `- ${c}`),
    `- ${SAFETY_TAIL}`,
    `OUTPUT FORMAT: ${spec.format}`,
  ].join("\n");
}

export function buildUserPrompt(input: GenerateInput): string {
  if (input.feature === "email") {
    const d = input.data;
    const audience = d.audience === "Other" && d.audienceOther ? d.audienceOther : d.audience;
    return [
      "Generate the email from these user-provided details only:",
      `AUDIENCE: ${audience}`,
      `TONE: ${d.tone}`,
      `PURPOSE: ${d.purpose}`,
      `CONTEXT: ${d.context}`,
      `DESIRED OUTCOME: ${d.outcome}`,
    ].join("\n");
  }

  if (input.feature === "meeting") {
    return [
      "Summarise the following raw meeting notes. Use only what is written here.",
      "--- BEGIN NOTES ---",
      input.data.notes,
      "--- END NOTES ---",
    ].join("\n");
  }

  if (input.feature === "task") {
    const d = input.data;
    return [
      `TODAY'S DATE: ${d.today}`,
      `AVAILABLE WORKING HOURS: ${d.workingHours || "Not specified"}`,
      "TASKS:",
      ...d.tasks.map(
        (t, i) =>
          `${i + 1}. Name: ${t.name} | Priority: ${t.priority} | Deadline: ${
            t.deadline || "Not specified"
          } | Description: ${t.description || "Not specified"}`,
      ),
    ].join("\n");
  }

  return [`DEPTH REQUESTED: ${input.data.depth}`, `TOPIC OR QUESTION: ${input.data.topic}`].join(
    "\n",
  );
}

/** Runs the gateway call as a stream and returns the completed text. */
export async function runFeatureGeneration(input: GenerateInput): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway(CHAT_MODEL),
    system: buildSystemPrompt(input.feature),
    prompt: buildUserPrompt(input),
  });

  return await result.text;
}
