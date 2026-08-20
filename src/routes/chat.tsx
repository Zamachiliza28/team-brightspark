import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { Info, RotateCcw, SendHorizontal, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useDemoMode } from "@/components/demo-mode";
import { DEMO_BADGE, OUTPUT_REMINDER } from "@/lib/ai-features";
import { buildDemoChatReply } from "@/lib/demo-data";
import { logActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Ask the workplace productivity assistant for help with emails, meetings, planning and research, with session memory and quick prompts.",
      },
      { property: "og:title", content: "AI Workplace Chatbot — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Conversational workplace help that asks for context instead of assuming it.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string; demo?: boolean };

const QUICK_PROMPTS = [
  "Help me prepare for a meeting",
  "Write an email to my manager",
  "Plan my day around three deadlines",
  "Summarise how to run a better stand-up",
  "What should I ask in a project kickoff?",
];

const GREETING: Msg = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello. I'm your workplace productivity assistant. I can help you draft communications, prepare for meetings, plan your workload and structure research.\n\nWhat would you like to work on? If I'm missing context, I'll ask before assuming.",
};

function ChatPage() {
  const { demoMode } = useDemoMode();
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setBusy(true);
    logActivity({ tool: "AI Workplace Chatbot", to: "/chat", summary: text.slice(0, 90), demo: demoMode });

    const pushAssistant = (content: string, demo: boolean) =>
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content, demo }]);

    try {
      if (demoMode) {
        await new Promise((r) => setTimeout(r, 500));
        pushAssistant(buildDemoChatReply(text), true);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Chat request failed (${response.status})`);
      }

      if (response.headers.get("x-demo-fallback") === "1") {
        const notice = await response.text();
        toast.warning(notice || "AI service unavailable.");
        pushAssistant(buildDemoChatReply(text), true);
        return;
      }

      const id = crypto.randomUUID();
      setMessages((m) => [...m, { id, role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, content: acc } : msg)));
      }
      if (!acc.trim()) {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === id ? { ...msg, content: buildDemoChatReply(text), demo: true } : msg,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.warning("Could not reach the AI service — showing a demonstration reply.");
      pushAssistant(buildDemoChatReply(text), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <section className="surface-panel flex h-[calc(100vh-16rem)] min-h-[28rem] flex-col overflow-hidden">
        <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" ? (
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-accent/12 text-accent ring-1 ring-accent/25">
                  <Sparkles className="size-4" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/50",
                )}
              >
                {msg.demo ? (
                  <Badge
                    variant="outline"
                    className="mb-2 border-warning/50 bg-warning/15 text-warning-foreground"
                  >
                    {DEMO_BADGE}
                  </Badge>
                ) : null}
                {msg.role === "assistant" ? (
                  <div className="ai-prose">
                    <ReactMarkdown>{msg.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {busy ? (
            <p className="flex items-center gap-2 ps-11 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse text-accent" />
              Thinking…
            </p>
          ) : null}
        </div>

        <div className="border-t border-border p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask about emails, meetings, planning or research…"
              className="min-h-11 resize-none"
            />
            <Button type="submit" size="icon" className="size-11" disabled={busy || !input.trim()}>
              <SendHorizontal className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {OUTPUT_REMINDER}
          </p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface-panel p-4">
          <h2 className="text-sm font-semibold text-foreground">Quick prompts</h2>
          <div className="mt-3 flex flex-col gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                disabled={busy}
                onClick={() => void send(p)}
                className="rounded-full border border-border px-3 py-2 text-start text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-accent/10 disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-panel space-y-3 p-4">
          <h2 className="text-sm font-semibold text-foreground">Session</h2>
          <p className="text-xs text-muted-foreground">
            This conversation keeps memory of the current session only. Nothing is stored after you
            reset or leave the page.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setMessages([GREETING]);
              setInput("");
            }}
          >
            <RotateCcw className="size-4" />
            Reset conversation
          </Button>
        </div>
      </aside>
    </div>
  );
}
