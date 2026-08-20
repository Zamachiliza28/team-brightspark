import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PROMPT_ARCHITECTURE, type FeatureId } from "@/lib/ai-features";

export function ToolPage({
  feature,
  form,
  output,
}: {
  feature: FeatureId;
  form: React.ReactNode;
  output: React.ReactNode;
}) {
  const spec = PROMPT_ARCHITECTURE[feature];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-4">
        <section className="surface-panel p-5">{form}</section>

        <Accordion type="single" collapsible className="surface-panel px-4">
          <AccordionItem value="prompt" className="border-none">
            <AccordionTrigger className="text-sm font-medium">
              Structured prompt used
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Role: </span>
                {spec.role}
              </p>
              <p>
                <span className="font-semibold text-foreground">Task: </span>
                {spec.task}
              </p>
              <div>
                <span className="font-semibold text-foreground">Constraints:</span>
                <ul className="mt-1 ms-4 list-disc space-y-1">
                  {spec.constraints.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <p>
                <span className="font-semibold text-foreground">Format: </span>
                {spec.format}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <section className="surface-panel min-h-[24rem] p-5">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Generated output
        </h2>
        {output}
      </section>
    </div>
  );
}
