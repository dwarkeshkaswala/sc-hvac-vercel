"use client";

import { useEffect, useState } from "react";
import type { BrandingContent } from "@/lib/content";
import { defaultBranding } from "@/lib/content";
import { saveBrandingAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";
import MediaPicker from "@/components/MediaPicker";

interface Props { initial: BrandingContent; saved: boolean }

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
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[500px] shrink-0 space-y-5">
        <div>
          <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Branding</h1>
          <p className="text-[13.5px] text-[#666] mt-1">Manage your site identity, logos, colors, and meta images.</p>
        </div>

        {msg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        {/* Site Identity */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">Site identity</p>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-[#999] mb-1.5">Site Name</p>
              <input className={inp} value={d.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="Shreeji Cooling" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#999] mb-1.5">Tagline</p>
              <input className={inp} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Precision climate engineering" />
            </div>
          </div>
        </div>

        {/* Logos & Favicon */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">Logos & favicon</p>
          <MediaPicker value={d.logo} onChange={(url) => set("logo", url)} label="Logo (light background)" dimensions="400 × 100" aspectRatio="4:1" />
          <div className="mt-4">
            <MediaPicker value={d.logoDark} onChange={(url) => set("logoDark", url)} label="Logo (dark background)" dimensions="400 × 100" aspectRatio="4:1" />
          </div>
          <div className="mt-4">
            <MediaPicker value={d.favicon} onChange={(url) => set("favicon", url)} label="Favicon" dimensions="512 × 512" aspectRatio="1:1" />
          </div>
        </div>

        {/* OG Image */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">Social share image</p>
          <MediaPicker value={d.ogImage} onChange={(url) => set("ogImage", url)} label="OG Image (shown when shared on social media)" dimensions="1200 × 630" aspectRatio="1.91:1" />
        </div>

        {/* Colors */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999]">Site colors</p>
            <button
              type="button"
              onClick={() => setD((prev) => ({ ...prev, colors: { ...defaultBranding.colors } }))}
              className="text-[11px] font-semibold text-[#0000B8] hover:text-[#000096]"
            >
              Reset to Default
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ColorField label="Primary" value={d.colors.primary} onChange={(v) => setColor("primary", v)} />
            <ColorField label="Primary Dark" value={d.colors.primaryDark} onChange={(v) => setColor("primaryDark", v)} />
            <ColorField label="Accent" value={d.colors.accent} onChange={(v) => setColor("accent", v)} />
            <ColorField label="Background" value={d.colors.background} onChange={(v) => setColor("background", v)} />
            <ColorField label="Text" value={d.colors.text} onChange={(v) => setColor("text", v)} />
            <ColorField label="Muted" value={d.colors.muted} onChange={(v) => setColor("muted", v)} />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all duration-200"
        >
          Save branding
        </button>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Branding">
          <div className="p-5 bg-[#FAFAFA]">
            {/* Header preview */}
            <div className="rounded-[14px] border border-[#E5E7EB] overflow-hidden bg-white mb-4">
              <div className="p-5" style={{ background: d.colors.background }}>
                <div className="flex items-center gap-3 mb-3">
                  {d.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={d.logo} alt="Logo" className="h-7 object-contain" />
                  ) : (
                    <div className="h-7 w-20 rounded bg-[#E5E7EB] flex items-center justify-center">
                      <span className="text-[8px] text-[#BBB] font-bold">LOGO</span>
                    </div>
                  )}
                  <span className="text-[14px] font-bold" style={{ color: d.colors.text }}>
                    {d.siteName || <span className="italic text-[#DDD]">Site Name</span>}
                  </span>
                </div>
                <p className="text-[11px] leading-[1.6]" style={{ color: d.colors.muted }}>
                  {d.tagline || <span className="italic text-[#DDD]">Tagline…</span>}
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 rounded-[6px] text-white text-[10px] font-semibold" style={{ background: d.colors.primary }}>Primary</span>
                  <span className="px-3 py-1 rounded-[6px] text-white text-[10px] font-semibold" style={{ background: d.colors.primaryDark }}>Dark</span>
                  <span className="px-3 py-1 rounded-[6px] text-white text-[10px] font-semibold" style={{ background: d.colors.accent }}>Accent</span>
                </div>
              </div>
            </div>

            {/* Favicon + OG row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-center">
                {d.favicon ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={d.favicon} alt="Favicon" className="w-8 h-8 mx-auto mb-2" />
                ) : (
                  <div className="w-8 h-8 mx-auto mb-2 rounded bg-[#E5E7EB]" />
                )}
                <p className="text-[8.5px] text-[#999] font-semibold uppercase tracking-[0.06em]">Favicon</p>
              </div>
              <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-center">
                {d.ogImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={d.ogImage} alt="OG Image" className="w-full h-12 object-cover rounded mb-2" />
                ) : (
                  <div className="w-full h-12 rounded bg-[#E5E7EB] mb-2" />
                )}
                <p className="text-[8.5px] text-[#999] font-semibold uppercase tracking-[0.06em]">Social Image</p>
              </div>
            </div>
          </div>
        </PreviewShell>
      </div>
    </div>
  );
}

/* ── Helpers ─── */

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-1.5">{label}</p>
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
          className="flex-1 h-[38px] px-3 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13px] text-[#111] font-mono placeholder-[#BBB] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

const inp = "w-full h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all";
