import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { CHAT_MODEL, createLovableAiGatewayProvider, describeGatewayError, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";
import { buildSystemPrompt } from "@/lib/ai.server";

type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
        const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : null;
        if (!messages || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const trimmed = messages
          .filter((m) => typeof m?.content === "string" && m.content.trim().length > 0)
          .slice(-20)
          .map((m) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: m.content,
          }));

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI service is not configured.", {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8", "X-Demo-Fallback": "1" },
          });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
          const result = streamText({
            model: gateway(CHAT_MODEL),
            system: buildSystemPrompt("chat"),
            messages: trimmed,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          console.error("[ai] chat failed", error);
          return new Response(describeGatewayError(error), {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8", "X-Demo-Fallback": "1" },
          });
        }
      },
    },
  },
});
