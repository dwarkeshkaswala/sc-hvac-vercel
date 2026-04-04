"use client";

import { useEffect, useState } from "react";
import type { HeroContent } from "@/lib/content";
import { saveHeroDataAction } from "@/app/admin/actions";

interface Props {
  initial: HeroContent;
  saved: boolean;
}

export default function HeroEditor({ initial, saved }: Props) {
  const [d, setD] = useState<HeroContent>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

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
    setMsg("Saved!");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[500px] shrink-0 space-y-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Hero Section</h1>
          <p className="text-[13.5px] text-[#666] mt-1">Edit the homepage hero text, phone number, and stats.</p>
        </div>

        {msg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        <Card title="Badge text">
          <EInput value={d.badge} placeholder="Surat's most trusted HVAC partner" onChange={(v) => set("badge", v)} />
        </Card>

        <Card title="Headline (3 lines)">
          <div className="space-y-3">
            <EInput value={d.line1} placeholder="Line 1" label="Line 1" onChange={(v) => set("line1", v)} />
            <EInput value={d.line2} placeholder="Line 2 (lighter colour)" label="Line 2 (lighter)" onChange={(v) => set("line2", v)} />
            <EInput value={d.line3} placeholder="Line 3" label="Line 3" onChange={(v) => set("line3", v)} />
          </div>
        </Card>

        <Card title="Subheadline">
          <ETextarea value={d.subheadline} rows={3} onChange={(v) => set("subheadline", v)} />
        </Card>

        <Card title="Phone number">
          <EInput value={d.phone} placeholder="+91 9054190245" onChange={(v) => set("phone", v)} />
        </Card>

        <Card title="Stats (4 items)">
          <div className="space-y-3">
            {d.stats.map((s, i) => (
              <div key={i} className="flex gap-3">
                <EInput value={s.value} placeholder="500+" label="Value" onChange={(v) => setStat(i, "value", v)} />
                <EInput value={s.label} placeholder="Projects Delivered" label="Label" onChange={(v) => setStat(i, "label", v)} />
              </div>
            ))}
          </div>
        </Card>

        <button
          onClick={handleSave}
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all duration-200"
        >
          Save changes
        </button>
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
    </div>
  );
}

/* ── Shared form sub-components ───────────────────────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
      <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">{title}</p>
      {children}
    </div>
  );
}

function EInput({
  value, onChange, placeholder, label,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string;
}) {
  return (
    <div className={label ? "flex-1 min-w-0" : ""}>
      {label && <p className="text-[11px] font-semibold text-[#999] mb-1.5">{label}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
          text-[13.5px] text-[#111] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
          transition-all duration-200"
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
        text-[13.5px] text-[#111] leading-[1.7] resize-y
        focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
        transition-all duration-200"
    />
  );
}

/* ── Shared preview chrome ────────────────────────────────────── */

export function PreviewShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[#E5E7EB] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E5E7EB] bg-[#F9F9F9]">
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
