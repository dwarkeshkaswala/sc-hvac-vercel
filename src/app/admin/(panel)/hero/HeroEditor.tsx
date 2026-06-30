"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroContent } from "@/lib/content";
import { saveHeroDataAction } from "@/app/admin/actions";
import { useToast, SaveButton, FormCard, PageHeader, UnsavedBanner } from "../components/AdminUI";

interface Props {
  initial: HeroContent;
  saved: boolean;
}

export default function HeroEditor({ initial, saved }: Props) {
  const [d, setD] = useState<HeroContent>(initial);
  const { toast } = useToast();
  const initialRef = useRef(JSON.stringify(initial));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(d) !== initialRef.current);
  }, [d]);

  useEffect(() => {
    if (saved) toast("success", "Changes saved successfully");
  }, [saved, toast]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function set<K extends keyof HeroContent>(k: K, v: HeroContent[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  function setStat(i: number, f: "value" | "label", v: string) {
    setD((prev) => {
      const stats = [...prev.stats];
      stats[i] = { ...stats[i], [f]: v };
      return { ...prev, stats };
    });
  }

  async function handleSave() {
    await saveHeroDataAction(d);
    initialRef.current = JSON.stringify(d);
    setDirty(false);
    toast("success", "Hero section saved");
  }

  function handleDiscard() {
    setD(JSON.parse(initialRef.current));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[500px] shrink-0 space-y-5">
        <PageHeader
          title="Hero Section"
          description="Edit the homepage hero text, phone number, and stats."
          badge={dirty ? <span className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">Unsaved</span> : undefined}
        />

        <FormCard title="Badge text" description="Shown above the main headline">
          <EInput value={d.badge} placeholder="India's most trusted HVAC partner" onChange={(v) => set("badge", v)} />
        </FormCard>

        <FormCard title="Headline" description="3-line main headline">
          <div className="space-y-3">
            <EInput value={d.line1} placeholder="Line 1" label="Line 1" onChange={(v) => set("line1", v)} />
            <EInput value={d.line2} placeholder="Line 2 (lighter colour)" label="Line 2 (accent)" onChange={(v) => set("line2", v)} />
            <EInput value={d.line3} placeholder="Line 3" label="Line 3" onChange={(v) => set("line3", v)} />
          </div>
        </FormCard>

        <FormCard title="Subheadline">
          <ETextarea value={d.subheadline} rows={3} onChange={(v) => set("subheadline", v)} />
        </FormCard>

        <FormCard title="Phone number" description="Displayed in the CTA button">
          <EInput value={d.phone} placeholder="+91 9054190245" onChange={(v) => set("phone", v)} />
        </FormCard>

        <FormCard title="Stats" description="4 stats shown in the hero strip">
          <div className="space-y-3">
            {d.stats.map((s, i) => (
              <div key={i} className="flex gap-3">
                <EInput value={s.value} placeholder="500+" label="Value" onChange={(v) => setStat(i, "value", v)} />
                <EInput value={s.label} placeholder="Projects Delivered" label="Label" onChange={(v) => setStat(i, "label", v)} />
              </div>
            ))}
          </div>
        </FormCard>

        <SaveButton onClick={handleSave} hasChanges={dirty} />
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Hero">
          <div className="p-6 bg-[#FAFAFA]">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E5E7EB] rounded-full text-[10px] text-[#555] mb-5 font-medium">
              <span className="relative flex w-1.5 h-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-[#22C55E] block" />
              </span>
              {d.badge || <span className="italic text-[#BBBBBB]">Badge text</span>}
            </div>

            {/* Headline */}
            <h2 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] mb-3">
              {d.line1 || <span className="text-[#E0E0E0]">Line 1</span>}
              <br />
              <span className="text-[#AAAAAA]">{d.line2 || <span className="text-[#E0E0E0]">Line 2</span>}</span>
              <br />
              {d.line3 || <span className="text-[#E0E0E0]">Line 3</span>}
            </h2>

            {/* Subheadline */}
            <p className="text-[11.5px] text-[#666] leading-[1.75] max-w-[340px] mb-5">
              {d.subheadline || <span className="italic text-[#CCCCCC]">Subheadline…</span>}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#111] text-white text-[11px] font-semibold">
                Start a Project →
              </span>
              <span className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full border border-[#E5E7EB] text-[#111] text-[11px] font-medium">
                ☎&nbsp;{d.phone || "+91 …"}
              </span>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-px bg-[#E5E7EB] rounded-[14px] overflow-hidden border border-[#E5E7EB]">
              {d.stats.map((s, i) => (
                <div key={i} className="bg-white px-4 py-3">
                  <p className="text-[20px] font-black tracking-[-0.04em] text-[#111] leading-none mb-0.5">
                    {s.value || <span className="text-[#E0E0E0]">—</span>}
                  </p>
                  <p className="text-[8.5px] uppercase tracking-[0.07em] text-[#999] font-semibold">
                    {s.label || "Label"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PreviewShell>
      </div>

      {/* Unsaved changes banner */}
      <UnsavedBanner show={dirty} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}

/* ── Shared form sub-components ───────────────────────────────── */

function EInput({
  value, onChange, placeholder, label,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string;
}) {
  return (
    <div className={label ? "flex-1 min-w-0" : ""}>
      {label && <p className="text-[11.5px] font-semibold text-[#666] mb-1.5">{label}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
          text-[13.5px] text-[#111] placeholder:text-[#CCC]
          focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
          hover:border-[#D0D0D0] transition-all duration-200"
      />
    </div>
  );
}

function ETextarea({
  value, onChange, rows = 4,
}: {
  value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3.5 py-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
        text-[13.5px] text-[#111] leading-[1.7] resize-y placeholder:text-[#CCC]
        focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
        hover:border-[#D0D0D0] transition-all duration-200"
    />
  );
}

/* ── Shared preview chrome ────────────────────────────────────── */

export function PreviewShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="ml-2 text-[10.5px] text-[#999] font-medium tracking-tight">{label}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[9px] text-[#BBBBBB] font-semibold uppercase tracking-[0.06em]">Live Preview</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
        {children}
      </div>
    </div>
  );
}
