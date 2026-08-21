import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronsLeft,
  ChevronsRight,
  FlaskConical,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";
import { NAV_ITEMS, PUBLIC_NAV, navForPath, type NavItem } from "@/lib/nav";
import { GLOBAL_DISCLAIMER } from "@/lib/ai-features";
import { useDemoMode } from "@/components/demo-mode";
import { displayName, initialsFor, jobTitle, useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/30">
        <Sparkles className="size-5" />
      </span>
      {collapsed ? null : (
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-semibold text-sidebar-accent-foreground">
            Workplace AI
          </span>
          <span className="block truncate text-xs text-sidebar-foreground/70">
            Productivity Assistant
          </span>
        </span>
      )}
    </div>
  );
}

function NavLinks({
  collapsed,
  onNavigate,
  items,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  items: NavItem[];
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          title={collapsed ? item.label : undefined}
          activeOptions={{ exact: item.to === "/" }}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-0",
          )}
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-sidebar-primary)]",
          }}
        >
          <item.icon className="size-4.5 shrink-0" />
          {collapsed ? null : <span className="truncate">{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = navForPath(pathname);
  const { demoMode, setDemoMode } = useDemoMode();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/api/")) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-e border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[272px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavLinks collapsed={collapsed} />
        <div className="border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {collapsed ? null : "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[272px] border-sidebar-border bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-full flex-col">
                  <Brand />
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                {current.title}
              </h1>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {current.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
              <FlaskConical
                className={cn("size-4", demoMode ? "text-warning" : "text-muted-foreground")}
              />
              <Label
                htmlFor="demo-mode"
                className="hidden cursor-pointer text-xs font-medium text-muted-foreground sm:block"
              >
                Demo mode
              </Label>
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={setDemoMode}
                aria-label="Toggle demonstration / fallback mode"
              />
            </div>

            <div className="flex items-center gap-2 border-s border-border ps-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {USER.initials}
              </span>
              <span className="hidden leading-tight md:block">
                <span className="block text-sm font-medium text-foreground">{USER.name}</span>
                <span className="block text-xs text-muted-foreground">{USER.role}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/60 px-4 py-2 text-xs text-muted-foreground sm:px-6">
            <AlertTriangle className="size-3.5 text-warning" />
            <span className="font-medium text-foreground">{GLOBAL_DISCLAIMER}</span>
            {demoMode ? (
              <Badge
                variant="outline"
                className="ms-auto border-warning/50 bg-warning/15 text-warning-foreground"
              >
                Demonstration Mode active — outputs are simulated
              </Badge>
            ) : null}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
          AI Workplace Productivity Assistant · Built with responsible-AI guardrails ·{" "}
          <Link to="/about" className="text-accent underline">
            Responsible AI
          </Link>
        </footer>
      </div>
    </div>
  );
}
