import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolPage } from "@/components/tool-page";
import { AiOutput, EmptyOutput, OutputSkeleton } from "@/components/ai-output";
import { useFeatureGeneration } from "@/lib/use-generate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured minutes: summary, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Structured minutes from messy notes, without invented decisions or deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Weekly ops sync - attendees: Thabo, Lerato, Sipho
Thabo: onboarding backlog is at 34 accounts, down from 51.
Lerato raised that the vendor portal times out during bulk uploads. She will open a ticket.
Agreed: we move the Friday review to 14:00 permanently.
Sipho suggested we trial a second QA pass, no decision taken.
Budget sign-off still pending with finance.`;

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const { result, busy, run, regenerate, reset } = useFeatureGeneration({
    tool: "Meeting Notes Summarizer",
    to: "/meetings",
  });

  const valid = notes.trim().length > 20;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    void run(
      { feature: "meeting", data: { notes } },
      `${notes.trim().split(/\s+/).length} words summarised`,
    );
  };

  return (
    <ToolPage
      feature="meeting"
      form={
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Raw meeting notes or transcript</Label>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here. Anything not written here will be reported as 'Not specified'."
              required
            />
            <p className="text-xs text-muted-foreground">
              {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "Minimum 20 characters"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!valid || busy}>
              <FileText className="size-4" />
              {busy ? "Summarising…" : "Summarise notes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setNotes(SAMPLE)}>
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setNotes("");
                reset();
              }}
            >
              Clear
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
          <EmptyOutput hint="Paste notes to get a summary, key discussion points, decisions, action items, owners and deadlines." />
        )
      }
    />
  );
}
