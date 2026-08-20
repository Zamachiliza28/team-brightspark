import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, History, Lightbulb, RefreshCw, Sparkles, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FEATURE_NAV } from "@/lib/nav";
import { GLOBAL_DISCLAIMER } from "@/lib/ai-features";
import { clearActivity, relativeTime, useActivity } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One workspace for AI-assisted email drafting, meeting summaries, task planning, research briefings and a workplace chatbot — with responsible-AI guardrails.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five focused AI tools for enterprise professionals and teams, with structured prompts and human-review reminders.",
      },
    ],
  }),
  component: Dashboard,
});

const TIPS = [
  "Batch shallow work — email, approvals, admin — into two fixed windows a day and protect the rest for deep work.",
  "Write the decision at the top of every meeting note. If there was no decision, say so explicitly.",
  "Before adding a task, ask whether it has an owner and a date. If not, it is an idea, not a task.",
  "Send one ask per email. Two asks in one message halve the chance either gets done.",
  "Review AI drafts for tone before facts, then facts before sending. Both matter, tone slips more quietly.",
  "Block a 45-minute buffer daily. Days without slack turn every small surprise into an overrun.",
];

const QUICK_ACTIONS = [
  { to: "/email", label: "Draft an email" },
  { to: "/meetings", label: "Summarise notes" },
  { to: "/tasks", label: "Plan my day" },
  { to: "/research", label: "Research a topic" },
  { to: "/chat", label: "Ask the assistant" },
] as const;

function Dashboard() {
  const activity = useActivity();
  const [tipIndex, setTipIndex] = useState(0);

  return (
    <div className="space-y-6">
      <section className="surface-ink rounded-2xl p-6 sm:p-9">
        <Badge
          variant="outline"
          className="border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary gap-1.5"
        >
          <Sparkles className="size-3.5" />
          Enterprise AI workspace
        </Badge>
        <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold sm:text-4xl">
          Welcome back, Zamachiliza
        </h2>
        <p className="mt-3 max-w-2xl text-sm/relaxed text-sidebar-foreground/80 sm:text-base/relaxed">
          Five focused assistants for the work that eats your day: writing, summarising, planning and
          researching. Every tool runs a fixed, auditable prompt contract, so the output shape is the
          same every time — and always yours to review before it leaves the building.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/email">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Link to="/about">Responsible AI</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-sidebar-foreground/65">{GLOBAL_DISCLAIMER}</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Your assistants
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURE_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="surface-panel hover-lift group flex flex-col gap-3 p-5"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/25">
                <item.icon className="size-5" />
              </span>
              <span className="font-display text-base font-semibold text-foreground">
                {item.label}
              </span>
              <span className="text-sm text-muted-foreground">{item.short}</span>
              <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-accent">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface-panel p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Zap className="size-4 text-accent" /> Quick actions
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Button key={action.to} asChild variant="outline" className="justify-between">
                <Link to={action.to}>
                  {action.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ))}
          </div>
        </section>

        <section className="surface-panel p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <History className="size-4 text-accent" /> Recent activity
            </h2>
            {activity.length ? (
              <Button
                variant="ghost"
                size="sm"
                className="ms-auto text-muted-foreground"
                onClick={clearActivity}
              >
                <Trash2 className="size-4" />
                Clear
              </Button>
            ) : null}
          </div>

          {activity.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No activity yet. Generate something and it will appear here — stored in your browser
              only.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {activity.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3 py-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={entry.to}
                      className="text-sm font-medium text-foreground hover:text-accent"
                    >
                      {entry.tool}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground">{entry.summary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {entry.demo ? (
                      <Badge
                        variant="outline"
                        className="border-warning/50 bg-warning/15 text-warning-foreground"
                      >
                        Demo
                      </Badge>
                    ) : null}
                    <span className="text-xs text-muted-foreground">{relativeTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="surface-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning ring-1 ring-warning/30">
          <Lightbulb className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Workplace productivity tip</h2>
          <p className="mt-1 text-sm text-muted-foreground">{TIPS[tipIndex]}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
        >
          <RefreshCw className="size-4" />
          Next tip
        </Button>
      </section>
    </div>
  );
}
