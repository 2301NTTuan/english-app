"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { AppState } from "@/types/domain";
import { createEmptyAccountState, localAppRepository } from "@/lib/storage/app-repository";
import { loadRemoteState, saveRemoteState } from "@/lib/storage/remote-app-repository";

type SyncStatus = "loading" | "synced" | "saving" | "offline" | "local";
interface AppContextValue { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; hydrated: boolean; syncStatus: SyncStatus }
const AppContext = createContext<AppContextValue | null>(null);
const publicPaths = new Set(["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/privacy", "/terms", "/attribution"]);

export function AppProvider({ children }: { children: ReactNode }) {
  const publicPage = publicPaths.has(usePathname());
  const [state, setState] = useState<AppState>(createEmptyAccountState);
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const remote = useRef(false); const skipFirstSave = useRef(true);
  useEffect(() => {
    if (publicPage) {
      remote.current = false;
      return;
    }
    skipFirstSave.current = true;
    const controller = new AbortController();
    void loadRemoteState(controller.signal).then((result) => {
      remote.current = result.authenticated;
      setState(result.authenticated ? result.state : localAppRepository.load());
      setSyncStatus(result.authenticated ? "synced" : "local"); setHydrated(true);
    }).catch(() => { setState(localAppRepository.load()); setSyncStatus("offline"); setHydrated(true); });
    return () => controller.abort();
  }, [publicPage]);
  useEffect(() => {
    if (!hydrated) return;
    if (skipFirstSave.current) { skipFirstSave.current = false; return; }
    if (!remote.current) { localAppRepository.save(state); return; }
    setSyncStatus("saving");
    const timeout = window.setTimeout(() => { void saveRemoteState(state).then((saved) => setSyncStatus(saved ? "synced" : "offline")).catch(() => setSyncStatus("offline")); }, 500);
    return () => window.clearTimeout(timeout);
  }, [state, hydrated]);
  const value = useMemo(() => ({ state, setState, hydrated, syncStatus }), [state, hydrated, syncStatus]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used inside AppProvider");
  return context;
}
