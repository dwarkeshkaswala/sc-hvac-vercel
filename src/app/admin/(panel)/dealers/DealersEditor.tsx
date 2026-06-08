"use client";

import { useEffect, useState } from "react";
import type { DealersContent, DealerItem } from "@/lib/content";
import { saveDealersAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";
import MediaPicker from "@/components/MediaPicker";

interface Props { initial: DealersContent; saved: boolean }

export default function DealersEditor({ initial, saved }: Props) {
  const [data, setData] = useState<DealersContent>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  function updateDealer(index: number, updates: Partial<DealerItem>) {
    setData((prev) => ({
      ...prev,
      dealers: prev.dealers.map((d, i) => (i === index ? { ...d, ...updates } : d)),
    }));
  }

  function addDealer() {
    setData((prev) => ({
      ...prev,
      dealers: [
        ...prev.dealers,
        { id: crypto.randomUUID(), name: "", logo: "", description: "", tags: [], accentColor: "#0000B8" },
      ],
    }));
  }

  function removeDealer(index: number) {
    setData((prev) => ({ ...prev, dealers: prev.dealers.filter((_, i) => i !== index) }));
  }

  function updateTrust(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      trustIndicators: prev.trustIndicators.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  }

  function addTrust() {
    setData((prev) => ({ ...prev, trustIndicators: [...prev.trustIndicators, { value: "", label: "" }] }));
  }

  function removeTrust(index: number) {
    setData((prev) => ({ ...prev, trustIndicators: prev.trustIndicators.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    await saveDealersAction(data);
    setMsg("Saved!");
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[560px] shrink-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Authorised Dealers</h1>
            <p className="text-[13.5px] text-[#666] mt-1">Manage dealer cards, logos, and trust indicators.</p>
          </div>
          <button onClick={addDealer} className="h-[38px] px-5 rounded-[10px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] transition-all">
            + Add dealer
          </button>
        </div>

        {msg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        {/* Section header text */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 mb-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">Section header</p>
          <div className="space-y-3">
            <input
              className={inp}
              placeholder="Heading"
              value={data.heading}
              onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))}
            />
            <textarea
              className={ta}
              placeholder="Subheading"
              rows={2}
              value={data.subheading}
              onChange={(e) => setData((p) => ({ ...p, subheading: e.target.value }))}
            />
          </div>
        </div>

        {/* Dealer cards */}
        <div className="space-y-4 mb-4">
          {data.dealers.map((dealer, idx) => (
            <div key={dealer.id} className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <input
                  className={`${inp} flex-1`}
                  placeholder="Dealer name"
                  value={dealer.name}
                  onChange={(e) => updateDealer(idx, { name: e.target.value })}
                />
                <button
                  onClick={() => removeDealer(idx)}
                  className="mt-2 text-[#ccc] hover:text-red-400 transition-colors text-[20px] leading-none"
                >×</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={dealer.accentColor}
                    onChange={(e) => updateDealer(idx, { accentColor: e.target.value })}
                    className="w-[38px] h-[38px] rounded-[8px] border border-[#E5E7EB] cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    className={`${inp} flex-1`}
                    placeholder="#hex"
                    value={dealer.accentColor}
                    onChange={(e) => updateDealer(idx, { accentColor: e.target.value })}
                  />
                </div>
                <MediaPicker
                  value={dealer.logo}
                  onChange={(url) => updateDealer(idx, { logo: url })}
                  label="Logo"
                  accept="image/*"
                />
              </div>

              <textarea
                className={`${ta} mb-3`}
                placeholder="Description"
                rows={2}
                value={dealer.description}
                onChange={(e) => updateDealer(idx, { description: e.target.value })}
              />

              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-1.5 block">Tags (comma-separated)</span>
                <input
                  className={inp}
                  placeholder="e.g. VRF Systems, Multi-Split, Commercial AC"
                  value={dealer.tags.join(", ")}
                  onChange={(e) =>
                    updateDealer(idx, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999]">Trust indicators</p>
            <button onClick={addTrust} className="text-[12px] font-semibold text-[#0000B8] hover:text-[#000096]">+ Add</button>
          </div>
          <div className="space-y-2">
            {data.trustIndicators.map((item, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input className={`${inp} w-[100px]`} placeholder="Value" value={item.value} onChange={(e) => updateTrust(idx, "value", e.target.value)} />
                <input className={`${inp} flex-1`} placeholder="Label" value={item.label} onChange={(e) => updateTrust(idx, "label", e.target.value)} />
                <button
                  onClick={() => removeTrust(idx)}
                  className="text-[#ccc] hover:text-red-400 transition-colors text-[18px] leading-none opacity-0 group-hover:opacity-100"
                >×</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
        >
          Save all dealers
        </button>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Dealers">
          <div className="p-5 bg-[#FAFAFA]">
            {/* Header */}
            <div className="text-center mb-5">
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#999] mb-1.5">Official Partners</p>
              <p className="text-[16px] font-bold text-[#111] tracking-[-0.02em] leading-tight">
                {data.heading || <span className="italic text-[#DDD]">Heading</span>}
              </p>
              <p className="text-[9.5px] text-[#888] mt-1.5 leading-[1.6] max-w-[280px] mx-auto">
                {data.subheading || <span className="italic text-[#DDD]">Subheading…</span>}
              </p>
            </div>

            {/* Dealer cards */}
            {data.dealers.length === 0 ? (
              <p className="text-[11px] text-[#CCC] italic text-center py-8">No dealers yet</p>
            ) : (
              <div className={`grid gap-3 ${data.dealers.length >= 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                {data.dealers.map((dealer) => (
                  <div key={dealer.id} className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    {dealer.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={dealer.logo} alt={dealer.name} className="h-8 mx-auto mb-2.5 object-contain" />
                    ) : (
                      <div className="h-8 flex items-center justify-center mb-2.5">
                        <span className="text-[11px] font-bold text-[#DDD]">{dealer.name || "Logo"}</span>
                      </div>
                    )}
                    <p className="text-[9px] text-[#888] leading-[1.6] mb-2 line-clamp-2">
                      {dealer.description || <span className="italic text-[#DDD]">Description…</span>}
                    </p>
                    {dealer.tags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {dealer.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[7.5px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${dealer.accentColor}15`, color: dealer.accentColor }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Trust row */}
            {data.trustIndicators.length > 0 && (
              <div className="flex justify-center gap-6 mt-4 pt-3 border-t border-[#E5E7EB]">
                {data.trustIndicators.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-[12px] font-bold text-[#111]">{item.value || "—"}</p>
                    <p className="text-[7.5px] uppercase tracking-[0.06em] text-[#999]">{item.label || "Label"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PreviewShell>
      </div>
    </div>
  );
}

const inp = "h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] w-full focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all";
const ta  = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] leading-[1.7] resize-y focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all";
