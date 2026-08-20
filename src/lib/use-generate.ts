import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateFeatureOutput } from "./ai.functions";
import { buildDemoOutput } from "./demo-data";
import type { GenerateInput } from "./ai-features";
import { logActivity } from "./activity";
import { useDemoMode } from "@/components/demo-mode";

type Result = { text: string; demo: boolean; notice: string | null };

export function useFeatureGeneration(meta: { tool: string; to: string }) {
  const generate = useServerFn(generateFeatureOutput);
  const { demoMode } = useDemoMode();
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastInput = useRef<GenerateInput | null>(null);

  const run = useCallback(
    async (input: GenerateInput, summary: string) => {
      lastInput.current = input;
      setBusy(true);
      setError(null);

      const finish = (next: Result) => {
        setResult(next);
        logActivity({ tool: meta.tool, to: meta.to, summary, demo: next.demo });
      };

      try {
        if (demoMode) {
          await new Promise((r) => setTimeout(r, 550));
          finish({
            text: buildDemoOutput(input),
            demo: true,
            notice: "Demonstration Mode is on, so no live AI request was made.",
          });
          return;
        }

        const response = await generate({ data: input });
        if (response.text) {
          finish({ text: response.text, demo: false, notice: null });
        } else {
          toast.warning(response.notice ?? "AI service unavailable — showing demo output.");
          finish({
            text: buildDemoOutput(input),
            demo: true,
            notice: response.notice,
          });
        }
      } catch (err) {
        console.error(err);
        toast.warning("Could not reach the AI service — showing demo output.");
        finish({
          text: buildDemoOutput(input),
          demo: true,
          notice: "The AI service could not be reached.",
        });
        setError(null);
      } finally {
        setBusy(false);
      }
    },
    [demoMode, generate, meta.to, meta.tool],
  );

  const regenerate = useCallback(() => {
    if (lastInput.current) void run(lastInput.current, "Regenerated output");
  }, [run]);

  const reset = useCallback(() => {
    lastInput.current = null;
    setResult(null);
    setError(null);
  }, []);

  return { result, busy, error, run, regenerate, reset, canRegenerate: !!lastInput.current };
}
