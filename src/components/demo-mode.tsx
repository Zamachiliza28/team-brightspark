import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type DemoModeContextValue = {
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
};

const DemoModeContext = createContext<DemoModeContextValue>({
  demoMode: false,
  setDemoMode: () => {},
});

const KEY = "awpa.demoMode";

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoModeState] = useState(false);

  useEffect(() => {
    try {
      setDemoModeState(window.localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const setDemoMode = useCallback((value: boolean) => {
    setDemoModeState(value);
    try {
      window.localStorage.setItem(KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ demoMode, setDemoMode }), [demoMode, setDemoMode]);
  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
