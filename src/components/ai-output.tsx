import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Info, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_BADGE, OUTPUT_REMINDER } from "@/lib/ai-features";
import { cn } from "@/lib/utils";

export function OutputSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="size-4 animate-pulse text-accent" />
        Generating a structured response…
      </div>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-10/12" />
    </div>
  );
}

export function EmptyOutput({ hint }: { hint: string }) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <Sparkles className="size-5 text-accent" />
      <p className="text-sm font-medium text-foreground">No output yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

type AiOutputProps = {
  text: string;
  demo?: boolean;
  notice?: string | null;
  onRegenerate?: () => void;
  onReset?: () => void;
  busy?: boolean;
  className?: string;
};

export function AiOutput({
  text,
  demo = false,
  notice,
  onRegenerate,
  onReset,
  busy,
  className,
}: AiOutputProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {demo ? (
          <Badge variant="outline" className="border-warning/50 bg-warning/15 text-warning-foreground">
            {DEMO_BADGE}
          </Badge>
        ) : (
          <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent">
            AI generated
          </Badge>
        )}
        <div className="ms-auto flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRegenerate ? (
            <Button type="button" variant="outline" size="sm" onClick={onRegenerate} disabled={busy}>
              <RefreshCw className={cn("size-4", busy && "animate-spin")} />
              Regenerate
            </Button>
          ) : null}
          {onReset ? (
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      {notice ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground">
          {notice} Showing built-in demonstration content instead.
        </p>
      ) : null}

      <div className="ai-prose rounded-lg border border-border bg-card p-4 sm:p-5">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
        {OUTPUT_REMINDER}
      </p>
    </div>
  );
}
