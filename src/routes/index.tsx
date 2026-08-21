import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEATURE_NAV } from "@/lib/nav";
import { GLOBAL_DISCLAIMER } from "@/lib/ai-features";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant for Teams" },
      {
        name: "description",
        content:
          "An enterprise AI workspace for drafting email, summarising meetings, planning tasks and building research briefings — with responsible-AI guardrails.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five focused AI assistants with structured prompt contracts, demo fallback mode and human-review reminders.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="space-y-6">
      <section className="surface-ink rounded-2xl p-6 sm:p-10">
        <Badge
          variant="outline"
          className="gap-1.5 border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary"
        >
          <Sparkles className="size-3.5" />
          Enterprise AI workspace
        </Badge>
        <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold sm:text-4xl">
          Five AI assistants for the work that eats your day
        </h2>
        <p className="mt-3 max-w-2xl text-sm/relaxed text-sidebar-foreground/80 sm:text-base/relaxed">
          Writing, summarising, planning, researching and answering questions — every tool runs a
          fixed, auditable prompt contract, so the output shape is the same every time and always
          yours to review before it leaves the building.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/auth">
              Get started <ArrowRight className="size-4" />
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
          What's inside
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURE_NAV.map((item) => (
            <div key={item.to} className="surface-panel flex flex-col gap-3 p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/25">
                <item.icon className="size-5" />
              </span>
              <span className="font-display text-base font-semibold text-foreground">
                {item.label}
              </span>
              <span className="text-sm text-muted-foreground">{item.short}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/25">
          <ShieldCheck className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Accounts keep outputs scoped to your team</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an account to open the assistants. Sign out at any time to end the active session
            on this device.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/auth">Sign in</Link>
        </Button>
      </section>
    </div>
  );
}
