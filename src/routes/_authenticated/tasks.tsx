import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2 } from "lucide-react";
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
import { PRIORITIES, type TaskItem } from "@/lib/ai-features";
import { useFeatureGeneration } from "@/lib/use-generate";

export const Route = createFileRoute("/_authenticated/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Prioritise your tasks into an Eisenhower matrix and get a realistic daily schedule with explicit reasoning.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Eisenhower prioritisation and a realistic day plan built from your real deadlines.",
      },
    ],
  }),
  component: TasksPage,
});

const blankTask = (): TaskItem => ({ name: "", description: "", deadline: "", priority: "Medium" });

function TasksPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [tasks, setTasks] = useState<TaskItem[]>([blankTask()]);
  const [workingHours, setWorkingHours] = useState("08:30–17:00");
  const { result, busy, run, regenerate, reset } = useFeatureGeneration({
    tool: "AI Task Planner",
    to: "/tasks",
  });

  const filled = tasks.filter((t) => t.name.trim().length > 0);
  const valid = filled.length > 0;

  const update = (index: number, patch: Partial<TaskItem>) =>
    setTasks((list) => list.map((t, i) => (i === index ? { ...t, ...patch } : t)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    void run(
      { feature: "task", data: { today, workingHours, tasks: filled } },
      `${filled.length} task${filled.length === 1 ? "" : "s"} prioritised`,
    );
  };

  return (
    <ToolPage
      feature="task"
      form={
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Today's date</Label>
              <Input value={today} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Working hours</Label>
              <Input
                id="hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 08:30–17:00"
              />
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Task {index + 1}
                  </span>
                  {tasks.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ms-auto size-8"
                      aria-label={`Remove task ${index + 1}`}
                      onClick={() => setTasks((list) => list.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
                <Input
                  value={task.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  placeholder="Task name"
                />
                <Textarea
                  rows={2}
                  value={task.description}
                  onChange={(e) => update(index, { description: e.target.value })}
                  placeholder="Description (optional)"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={task.deadline}
                    onChange={(e) => update(index, { deadline: e.target.value })}
                  />
                  <Select
                    value={task.priority}
                    onValueChange={(priority) => update(index, { priority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setTasks((list) => [...list, blankTask()])}
          >
            <Plus className="size-4" />
            Add another task
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!valid || busy}>
              <ListChecks className="size-4" />
              {busy ? "Planning…" : "Build my plan"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTasks([blankTask()]);
                reset();
              }}
            >
              Reset
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
          <EmptyOutput hint="Add your tasks with deadlines and priorities to get an Eisenhower matrix, reasoning, a recommended order and a daily schedule." />
        )
      }
    />
  );
}
