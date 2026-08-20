import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Boxes, Layers, Lock, ScanEye, ShieldCheck, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GLOBAL_DISCLAIMER, PROMPT_ARCHITECTURE } from "@/lib/ai-features";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Responsible AI — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "How the AI Workplace Productivity Assistant is built: prompt engineering architecture, technical stack, and safety protocols for bias, hallucination and confidentiality.",
      },
      { property: "og:title", content: "About & Responsible AI — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Prompt engineering architecture, technical stack and safety protocols.",
      },
    ],
  }),
  component: AboutPage,
});

const STACK = [
  { label: "Interface", value: "React 19 + TanStack Start (SSR), Tailwind CSS v4 design tokens" },
  { label: "Routing", value: "TanStack Router file-based routes with per-page metadata" },
  { label: "Server layer", value: "TanStack server functions and a streaming chat server route" },
  { label: "AI layer", value: "Lovable AI Gateway via the Vercel AI SDK (streamed responses)" },
  { label: "Resilience", value: "Deterministic demonstration data with transparent output tagging" },
  { label: "State", value: "Session-scoped chat memory; activity log kept in the browser only" },
];

const SAFETY = [
  {
    icon: ScanEye,
    title: "Hallucination controls",
    body: "Every prompt forbids inventing facts, dates, owners, statistics and citations. Where information is missing, the assistant must output 'Not specified' or a marked [placeholder] instead of guessing. Outputs separate confirmed items from suggestions.",
  },
  {
    icon: AlertTriangle,
    title: "Bias awareness",
    body: "Generated content can reflect biases present in training data — particularly in tone, seniority assumptions and cultural framing. Review language for fairness before it reaches clients, candidates or staff, and never use output as the sole basis for decisions about people.",
  },
  {
    icon: Lock,
    title: "Privacy and confidentiality",
    body: "Text you submit is sent to a third-party model provider for processing. Do not paste personal data, credentials, client-confidential material or anything covered by an NDA. The activity log stays in your browser and is never transmitted.",
  },
  {
    icon: ShieldCheck,
    title: "Human in the loop",
    body: "A global disclaimer and a per-output reminder are shown everywhere content is generated. Simulated content is always badged as a demo output so it can never be mistaken for a live model response.",
  },
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="surface-ink rounded-2xl p-6 sm:p-8">
        <Badge
          variant="outline"
          className="border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary"
        >
          Responsible AI
        </Badge>
        <h2 className="mt-4 max-w-2xl text-2xl font-semibold sm:text-3xl">
          Built for professional judgement, not to replace it
        </h2>
        <p className="mt-3 max-w-3xl text-sm/relaxed text-sidebar-foreground/80">
          {GLOBAL_DISCLAIMER} Every feature in this assistant is constrained by an explicit prompt
          contract, and every output carries a verification reminder.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel space-y-3 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Boxes className="size-5 text-accent" /> Project overview
          </h2>
          <p className="text-sm/relaxed text-muted-foreground">
            The AI Workplace Productivity Assistant brings five focused tools — email drafting,
            meeting summarisation, task planning, research synthesis and a conversational assistant
            — into a single enterprise workspace. Each tool takes structured input and returns a
            predictable, structured output that a professional can review, edit and use immediately.
          </p>
        </section>

        <section className="surface-panel space-y-3 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Target className="size-5 text-accent" /> Core problem and solution
          </h2>
          <p className="text-sm/relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Problem: </span>
            knowledge workers lose hours to repetitive writing, note-taking and re-prioritisation,
            and generic AI tools answer inconsistently because the prompt changes every time.
          </p>
          <p className="text-sm/relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Solution: </span>
            the prompt is owned by the application, not the user. Each feature enforces a fixed
            role, task, constraint set and output format server-side, so results are consistent,
            auditable and safe to hand to a colleague.
          </p>
        </section>
      </div>

      <section className="surface-panel space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Layers className="size-5 text-accent" /> Prompt engineering architecture
        </h2>
        <p className="text-sm text-muted-foreground">
          Every request is assembled server-side from four components: <strong>Role</strong>,{" "}
          <strong>Task</strong>, <strong>Constraints</strong> and <strong>Format</strong>. User input
          is passed as data only — it never overwrites the contract.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(PROMPT_ARCHITECTURE).map(([key, spec]) => (
            <article key={key} className="rounded-xl border border-border bg-muted/40 p-4">
              <h3 className="text-sm font-semibold">{spec.label}</h3>
              <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div>
                  <dt className="font-medium text-foreground">Role</dt>
                  <dd>{spec.role}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Task</dt>
                  <dd>{spec.task}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Constraints</dt>
                  <dd>
                    <ul className="ms-4 list-disc space-y-1">
                      {spec.constraints.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Format</dt>
                  <dd>{spec.format}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Technical architecture stack</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {STACK.map((row) => (
            <div key={row.label} className="rounded-lg border border-border p-3">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="surface-panel space-y-4 p-6">
        <h2 className="text-lg font-semibold">Safety protocols</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SAFETY.map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-muted/40 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <item.icon className="size-4 text-accent" />
                {item.title}
              </h3>
              <p className="mt-2 text-sm/relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <strong>Demonstration / Fallback Mode:</strong> when the AI service is offline, rate
          limited or out of credits — or when you switch the header toggle on — the app returns
          built-in realistic sample content badged “Demo Output – AI Service Unavailable”, so a
          simulated result is never presented as a live model response.
        </p>
      </section>
    </div>
  );
}
