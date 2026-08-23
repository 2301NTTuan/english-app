"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppState } from "@/types/domain";
import { createInitialState, localAppRepository } from "@/lib/storage/app-repository";

interface AppContextValue { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; hydrated: boolean }
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setState(localAppRepository.load()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localAppRepository.save(state); }, [state, hydrated]);
  const value = useMemo(() => ({ state, setState, hydrated }), [state, hydrated]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used inside AppProvider");
  return context;
}
