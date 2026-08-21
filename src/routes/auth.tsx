import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Create a workspace account or sign in to use the AI email, meeting, planning, research and chat assistants.",
      },
      { property: "og:title", content: "Sign in — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Secure access to your enterprise AI productivity workspace.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) void navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: String(form.get("display_name") ?? "").trim(),
          job_title: String(form.get("job_title") ?? "").trim(),
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — welcome to your workspace.");
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-md py-6">
      <div className="surface-panel p-6">
        <span className="grid size-11 place-items-center rounded-lg bg-accent/12 text-accent ring-1 ring-accent/25">
          <Lock className="size-5" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold">Workspace access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in or create an account to use the AI assistants. Sessions stay active on this device
          until you sign out.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-5 w-full"
          onClick={handleGoogle}
          disabled={busy}
        >
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or use email
          <span className="h-px flex-1 bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Create account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form className="mt-4 space-y-3" onSubmit={handleSignIn}>
              <div className="space-y-1.5">
                <Label htmlFor="signin-email">Work email</Label>
                <Input id="signin-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="mt-4 space-y-3" onSubmit={handleSignUp}>
              <div className="space-y-1.5">
                <Label htmlFor="signup-name">Display name</Label>
                <Input id="signup-name" name="display_name" required autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-title">Job title</Label>
                <Input id="signup-title" name="job_title" placeholder="Operations Lead" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Work email</Label>
                <Input id="signup-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-accent" />
          Your account secures access to AI outputs. Generated content still requires human review
          before use.
        </p>
      </div>
    </div>
  );
}
