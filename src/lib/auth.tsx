import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string;
  job_title: string;
};

type AuthValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({
  loading: true,
  session: null,
  user: null,
  profile: null,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      if (!next) setProfile(null);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    void supabase
      .from("profiles")
      .select("id, display_name, job_title")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setProfile(data as Profile);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      refreshProfile: async () => {
        if (!userId) return;
        const { data } = await supabase
          .from("profiles")
          .select("id, display_name, job_title")
          .eq("id", userId)
          .maybeSingle();
        if (data) setProfile(data as Profile);
      },
    }),
    [loading, session, profile, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Display helpers that never leak personal branding when signed out. */
export function displayName(profile: Profile | null, user: User | null) {
  return profile?.display_name?.trim() || user?.email?.split("@")[0] || "Team member";
}

export function jobTitle(profile: Profile | null) {
  return profile?.job_title?.trim() || "Workspace member";
}

export function initialsFor(name: string) {
  const parts = name.split(/[\s._-]+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]!.toUpperCase()).join("") || "U";
}
