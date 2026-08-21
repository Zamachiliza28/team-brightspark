import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DEPTHS } from "@/lib/ai-features";
import { useFeatureGeneration } from "@/lib/use-generate";

export const Route = createFileRoute("/_authenticated/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Synthesise any workplace topic into a briefing that separates established facts from assumptions and flags what needs verification.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Briefings with overview, key insights, recommendations and open questions.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<string>("Intermediate");
  const { result, busy, run, regenerate, reset } = useFeatureGeneration({
    tool: "AI Research Assistant",
    to: "/research",
  });

  const valid = topic.trim().length > 5;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    void run({ feature: "research", data: { topic, depth } }, topic.trim().slice(0, 90));
  };

  return (
    <ToolPage
      feature="research"
      form={
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Textarea
              id="topic"
              rows={6}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. What should we consider before rolling out a four-day work week in a support team?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPTHS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Simple gives a short orientation; Detailed produces a fuller analytical briefing.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!valid || busy}>
              <Search className="size-4" />
              {busy ? "Researching…" : "Research topic"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTopic("");
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
          <EmptyOutput hint="Enter a topic to get an overview, key insights, important points, recommendations and open questions." />
        )
      }
    />
  );
}
