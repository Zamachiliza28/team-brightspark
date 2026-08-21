import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolPage } from "@/components/tool-page";
import { AiOutput, EmptyOutput, OutputSkeleton } from "@/components/ai-output";
import { AUDIENCES, TONES, type EmailInput } from "@/lib/ai-features";
import { useFeatureGeneration } from "@/lib/use-generate";

export const Route = createFileRoute("/_authenticated/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from your audience, tone, purpose, context and desired outcome — no invented facts.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Draft precise, on-tone workplace emails with structured prompt engineering.",
      },
    ],
  }),
  component: EmailPage,
});

const BLANK: EmailInput = {
  audience: "Manager",
  audienceOther: "",
  tone: "Professional",
  purpose: "",
  context: "",
  outcome: "",
};

function EmailPage() {
  const [form, setForm] = useState<EmailInput>(BLANK);
  const { result, busy, run, regenerate, reset } = useFeatureGeneration({
    tool: "Smart Email Generator",
    to: "/email",
  });

  const valid = form.purpose.trim() && form.context.trim() && form.outcome.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    void run({ feature: "email", data: form }, form.purpose.trim().slice(0, 90));
  };

  return (
    <ToolPage
      feature="email"
      form={
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select
                value={form.audience}
                onValueChange={(audience) => setForm((f) => ({ ...f, audience }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(tone) => setForm((f) => ({ ...f, tone }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.audience === "Other" ? (
            <div className="space-y-2">
              <Label htmlFor="audienceOther">Describe the audience</Label>
              <Input
                id="audienceOther"
                value={form.audienceOther}
                onChange={(e) => setForm((f) => ({ ...f, audienceOther: e.target.value }))}
                placeholder="e.g. External auditor"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={form.purpose}
              onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
              placeholder="e.g. Request a one-week extension on the Q3 report"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              rows={5}
              value={form.context}
              onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
              placeholder="Facts the email must rely on. The assistant will not invent anything beyond this."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Desired outcome</Label>
            <Textarea
              id="outcome"
              rows={3}
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              placeholder="What should the recipient do after reading?"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!valid || busy}>
              <Send className="size-4" />
              {busy ? "Generating…" : "Generate email"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(BLANK);
                reset();
              }}
            >
              Clear form
            </Button>
          </div>
        </form>
      }
      output={
        busy ? (
          <OutputSkeleton />
        ) : result ? (
          <AiOutput
            text={result.text}
            demo={result.demo}
            notice={result.notice}
            onRegenerate={regenerate}
            onReset={reset}
            busy={busy}
          />
        ) : (
          <EmptyOutput hint="Fill in the purpose, context and desired outcome, then generate a draft with a subject line and body." />
        )
      }
    />
  );
}
