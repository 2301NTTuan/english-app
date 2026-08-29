"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CloudUpload, Download, RotateCcw, Trash2, Upload } from "lucide-react";
import { useAppState } from "@/components/app-provider";
import { PageHeader } from "@/components/ui";
import type { CEFRLevel, UserSettings } from "@/types/domain";
import { hasLocalLearningState, localAppRepository, normalizeState } from "@/lib/storage/app-repository";
import { appStateSchema, backupFileSchema, MAX_STATE_BYTES } from "@/lib/validation/app-state";
import { importRemoteState } from "@/lib/storage/remote-app-repository";

type Notice = { kind: "success" | "error"; message: string } | null;

export default function SettingsPage() {
  const router = useRouter();
  const { state, setState } = useAppState();
  const [draft, setDraft] = useState<UserSettings | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [deletePassword, setDeletePassword] = useState(""); const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const settings = draft ?? state.settings;

  const showNotice = (next: Notice) => { setNotice(next); window.setTimeout(() => setNotice(null), 2400); };
  const save = () => { setState((current) => ({ ...current, settings })); setDraft(null); showNotice({ kind: "success", message: "Learning preferences saved." }); };
  const reset = async () => {
    if (!window.confirm("Delete your learning history and keep only default preferences?")) return;
    try {
      const response = await fetch("/api/state/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "RESET" }) });
      if (!response.ok) throw new Error();
      const payload = await response.json() as { state: unknown }; const parsed = appStateSchema.safeParse(payload.state); if (!parsed.success) throw new Error();
      setState(parsed.data); setDraft(null); showNotice({ kind: "success", message: "Learning data reset." });
    } catch { showNotice({ kind: "error", message: "Learning data could not be reset." }); }
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `english-mastery-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
  };
  const importData = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > MAX_STATE_BYTES) throw new Error("TOO_LARGE");
      const candidate = JSON.parse(await file.text()) as unknown; const backup = backupFileSchema.safeParse(candidate); const legacy = appStateSchema.safeParse(candidate);
      const importedState = backup.success ? backup.data.state : legacy.success ? legacy.data : null;
      if (!importedState || !window.confirm("Replace your cloud learning data with this backup?")) throw new Error("INVALID_OR_CANCELLED");
      if (!await importRemoteState(importedState)) throw new Error("IMPORT_FAILED");
      setState(normalizeState(importedState)); setDraft(null); showNotice({ kind: "success", message: "Learning data imported." });
    }
    catch { showNotice({ kind: "error", message: "That file is not valid English Mastery data." }); }
    if (fileInput.current) fileInput.current.value = "";
  };
  const importBrowserData = async () => {
    if (!hasLocalLearningState()) { showNotice({ kind: "error", message: "No earlier browser data was found." }); return; }
    if (!window.confirm("Replace your cloud learning data with data previously saved in this browser?")) return;
    const localState = localAppRepository.load();
    if (await importRemoteState(localState)) { setState(localState); localAppRepository.clear(); showNotice({ kind: "success", message: "Browser data moved to your account." }); }
    else showNotice({ kind: "error", message: "Browser data could not be imported." });
  };
  const deleteAccount = async () => {
    if (deleteConfirmation !== "DELETE" || !deletePassword) { showNotice({ kind: "error", message: "Type DELETE and enter your password." }); return; }
    const response = await fetch("/api/account", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: deleteConfirmation, password: deletePassword }) });
    if (response.ok) { localAppRepository.clear(); router.replace("/register"); router.refresh(); return; }
    const body = await response.json() as { error?: string }; showNotice({ kind: "error", message: body.error ?? "Account deletion failed." });
  };

  return <>
    <PageHeader eyebrow="Make the plan yours" title="Settings" description="Set a sustainable target. The adaptive engine reduces new material when reviews or weaknesses need attention."/>
    <div aria-live="polite">{notice && <div className={`mb-4 rounded-xl border p-3 text-sm font-bold ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>{notice.message}</div>}</div>
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Learning preferences</h2>
        <div className="mt-6 space-y-7">
          <label className="block"><div className="mb-2 flex justify-between"><b className="text-sm">Current CEFR level</b><span className="badge">{settings.currentLevel}</span></div><select value={settings.currentLevel} onChange={(event) => setDraft({ ...settings, currentLevel: event.target.value as CEFRLevel })} className="h-12 w-full rounded-xl border border-[#dce6e1] bg-white px-3">{["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}</select></label>
          <Range label="Daily study target" value={settings.dailyTarget} min={10} max={60} suffix="items" onChange={(dailyTarget) => setDraft({ ...settings, dailyTarget })}/>
          <Range label="Maximum new words per day" value={settings.maxNewWordsPerDay} min={0} max={20} suffix="words" onChange={(maxNewWordsPerDay) => setDraft({ ...settings, maxNewWordsPerDay })}/>
          <Range label="Maximum new grammar topics per day" value={settings.maxNewGrammarTopicsPerDay} min={0} max={3} suffix="topics" onChange={(maxNewGrammarTopicsPerDay) => setDraft({ ...settings, maxNewGrammarTopicsPerDay })}/>
          <Range label="Desired retention" value={Math.round(settings.desiredRetention * 100)} min={80} max={97} suffix="%" onChange={(value) => setDraft({ ...settings, desiredRetention: value / 100 })}/>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-[#dce6e1] p-4"><span><b className="block text-sm">Show Vietnamese support</b><span className="muted text-xs">Meanings remain English-first.</span></span><input type="checkbox" checked={settings.showVietnamese} onChange={(event) => setDraft({ ...settings, showVietnamese: event.target.checked })} className="size-5 accent-[#17795b]"/></label>
          <label className="block"><div className="mb-2 text-sm font-bold">Interface language</div><select value={settings.interfaceLanguage} onChange={(event) => setDraft({ ...settings, interfaceLanguage: event.target.value as "en" | "vi" })} className="h-12 w-full rounded-xl border border-[#dce6e1] bg-white px-3"><option value="en">English</option><option value="vi">Vietnamese</option></select></label>
        </div>
        <div className="mt-8 flex flex-wrap gap-2"><button onClick={save} className="btn-primary"><Check size={17}/>Save preferences</button><button onClick={() => void reset()} className="btn-secondary gap-2"><RotateCcw size={15}/>Reset learning data</button></div>
      </section>
      <div className="space-y-5">
        <aside className="card p-5"><div className="eyebrow">How adaptation works</div><h2 className="mt-2 text-lg font-extrabold">Reviews protect memory</h2><ol className="muted mt-4 space-y-3 text-sm"><li><b className="text-[#15241f]">1.</b> Overdue and due reviews always stay in the plan.</li><li><b className="text-[#15241f]">2.</b> Weak dimensions and recurring mistakes come next.</li><li><b className="text-[#15241f]">3.</b> New words use remaining target capacity.</li><li><b className="text-[#15241f]">4.</b> A full backlog reduces new words to zero.</li></ol></aside>
        <section className="card p-5"><h2 className="font-extrabold">Your data</h2><p className="muted mt-1 text-sm">Export a backup or explicitly move earlier browser data into this account.</p><div className="mt-4 grid grid-cols-2 gap-2"><button className="btn-secondary gap-2" onClick={exportData}><Download size={15}/>Export</button><button className="btn-secondary gap-2" onClick={() => fileInput.current?.click()}><Upload size={15}/>Import file</button><button className="btn-secondary col-span-2 gap-2" onClick={() => void importBrowserData()}><CloudUpload size={15}/>Import this browser&apos;s data</button></div><input ref={fileInput} type="file" accept="application/json" className="sr-only" onChange={(event) => void importData(event.target.files?.[0])}/></section>
        <section className="card border-red-200 p-5"><h2 className="font-extrabold text-red-800">Delete account</h2><p className="muted mt-1 text-sm">This permanently deletes your account and learning data. Export a backup first if needed.</p><label className="mt-4 block text-xs font-bold">Type DELETE<input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-red-200 px-3"/></label><label className="mt-3 block text-xs font-bold">Current password<input type="password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-red-200 px-3"/></label><button className="mt-4 flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white" onClick={() => void deleteAccount()}><Trash2 size={15}/>Delete account</button></section>
      </div>
    </div>
  </>;
}

function Range({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="block"><div className="mb-2 flex justify-between"><b className="text-sm">{label}</b><span className="text-sm font-extrabold text-[#17795b]">{value} {suffix}</span></div><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[#17795b]"/><div className="muted mt-1 flex justify-between text-[10px]"><span>{min}</span><span>{max}</span></div></label>;
}
