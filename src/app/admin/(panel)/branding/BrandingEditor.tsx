"use client";

import { useEffect, useState } from "react";
import type { BrandingContent } from "@/lib/content";
import { saveBrandingAction } from "@/app/admin/actions";
import MediaPicker from "@/components/MediaPicker";

interface Props {
  initial: BrandingContent;
  saved: boolean;
}

export default function BrandingEditor({ initial, saved }: Props) {
  const [d, setD] = useState<BrandingContent>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  function set<K extends keyof BrandingContent>(k: K, v: BrandingContent[K]) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  function setColor(k: keyof BrandingContent["colors"], v: string) {
    setD((prev) => ({ ...prev, colors: { ...prev.colors, [k]: v } }));
  }

  async function handleSave() {
    await saveBrandingAction(d);
    setMsg("Saved!");
  }

  return (
    <div className="p-4 sm:p-8 max-w-[800px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Branding</h1>
        <p className="text-[13.5px] text-[#666] mt-1">Manage your site identity, logos, colors, and meta images.</p>
      </div>

      {msg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
          ✓ {msg}
        </div>
      )}

      {/* Site Identity */}
      <Section title="Site Identity">
        <Field label="Site Name">
          <input
            className={inp}
            value={d.siteName}
            onChange={(e) => set("siteName", e.target.value)}
            placeholder="Shreeji Cooling"
          />
        </Field>
        <Field label="Tagline">
          <input
            className={inp}
            value={d.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Precision climate engineering"
          />
        </Field>
      </Section>

      {/* Logos & Favicon */}
      <Section title="Logos & Favicon">
        <MediaPicker
          value={d.logo}
          onChange={(url) => set("logo", url)}
          label="Logo (light background)"
          dimensions="400 × 100"
          aspectRatio="4:1"
        />
        <div className="mt-4">
          <MediaPicker
            value={d.logoDark}
            onChange={(url) => set("logoDark", url)}
            label="Logo (dark background)"
            dimensions="400 × 100"
            aspectRatio="4:1"
          />
        </div>
        <div className="mt-4">
          <MediaPicker
            value={d.favicon}
            onChange={(url) => set("favicon", url)}
            label="Favicon"
            dimensions="512 × 512"
            aspectRatio="1:1"
          />
        </div>
      </Section>

      {/* OG / Social Image */}
      <Section title="Social Share Image">
        <MediaPicker
          value={d.ogImage}
          onChange={(url) => set("ogImage", url)}
          label="OG Image (shown when shared on social media)"
          dimensions="1200 × 630"
          aspectRatio="1.91:1"
        />
      </Section>

      {/* Colors */}
      <Section title="Site Colors">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <ColorField label="Primary" value={d.colors.primary} onChange={(v) => setColor("primary", v)} />
          <ColorField label="Primary Dark" value={d.colors.primaryDark} onChange={(v) => setColor("primaryDark", v)} />
          <ColorField label="Accent" value={d.colors.accent} onChange={(v) => setColor("accent", v)} />
          <ColorField label="Background" value={d.colors.background} onChange={(v) => setColor("background", v)} />
          <ColorField label="Text" value={d.colors.text} onChange={(v) => setColor("text", v)} />
          <ColorField label="Muted" value={d.colors.muted} onChange={(v) => setColor("muted", v)} />
        </div>
      </Section>

      {/* Live Preview */}
      <Section title="Preview">
        <div className="rounded-[14px] border border-[#E5E7EB] overflow-hidden">
          <div className="p-5" style={{ background: d.colors.background }}>
            <div className="flex items-center gap-3 mb-4">
              {d.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.logo} alt="Logo" className="h-8 object-contain" />
              )}
              <span className="text-[16px] font-bold" style={{ color: d.colors.text }}>{d.siteName}</span>
            </div>
            <p className="text-[13px]" style={{ color: d.colors.muted }}>{d.tagline}</p>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1.5 rounded-[8px] text-white text-[12px] font-medium" style={{ background: d.colors.primary }}>
                Primary
              </span>
              <span className="px-3 py-1.5 rounded-[8px] text-white text-[12px] font-medium" style={{ background: d.colors.primaryDark }}>
                Dark
              </span>
              <span className="px-3 py-1.5 rounded-[8px] text-white text-[12px] font-medium" style={{ background: d.colors.accent }}>
                Accent
              </span>
            </div>
          </div>
          {d.favicon && (
            <div className="px-5 py-3 border-t border-[#E5E7EB] flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.favicon} alt="Favicon" className="w-4 h-4" />
              <span className="text-[12px] text-[#888]">Favicon preview</span>
            </div>
          )}
        </div>
      </Section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="mt-6 h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
      >
        Save branding
      </button>
    </div>
  );
}

/* ── Helpers ─── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 mb-5">
      <h2 className="text-[14px] font-bold text-[#111] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[38px] h-[38px] rounded-[8px] border border-[#E5E7EB] cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-[38px] px-3 rounded-[8px] border border-[#E5E7EB] bg-white text-[13px] text-[#111] font-mono placeholder-[#BBB] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

const inp = "w-full h-[38px] px-3 rounded-[8px] border border-[#E5E7EB] bg-white text-[13px] text-[#111] placeholder-[#BBB] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all";
