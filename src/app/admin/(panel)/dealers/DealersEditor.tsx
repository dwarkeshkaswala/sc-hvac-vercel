"use client";

import { useState } from "react";
import { saveDealersAction } from "@/app/admin/actions";
import type { DealersContent, DealerItem } from "@/lib/content";
import MediaPicker from "@/components/MediaPicker";

export default function DealersEditor({ initial }: { initial: DealersContent }) {
  const [data, setData] = useState<DealersContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        {
          id: crypto.randomUUID(),
          name: "",
          logo: "",
          description: "",
          tags: [],
          accentColor: "#0000B8",
        },
      ],
    }));
  }

  function removeDealer(index: number) {
    setData((prev) => ({
      ...prev,
      dealers: prev.dealers.filter((_, i) => i !== index),
    }));
  }

  function updateTrustIndicator(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      trustIndicators: prev.trustIndicators.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  }

  function addTrustIndicator() {
    setData((prev) => ({
      ...prev,
      trustIndicators: [...prev.trustIndicators, { value: "", label: "" }],
    }));
  }

  function removeTrustIndicator(index: number) {
    setData((prev) => ({
      ...prev,
      trustIndicators: prev.trustIndicators.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await saveDealersAction(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-[800px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-[#111111] tracking-[-0.02em]">
            Authorised Dealers
          </h1>
          <p className="text-[14px] text-[#666] mt-1">
            Manage dealer cards, logos, and trust indicators.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-[10px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* Section text */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-[14px] font-semibold text-[#111] mb-4">Section Header</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Heading
            </label>
            <input
              value={data.heading}
              onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Subheading
            </label>
            <textarea
              value={data.subheading}
              onChange={(e) => setData((p) => ({ ...p, subheading: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Dealer cards */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[#111]">Dealers</h2>
          <button
            onClick={addDealer}
            className="text-[12px] font-semibold text-[#0000B8] hover:underline"
          >
            + Add Dealer
          </button>
        </div>

        {data.dealers.map((dealer, idx) => (
          <div
            key={dealer.id}
            className="bg-white rounded-[16px] border border-[#E5E7EB] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-[#333]">
                {dealer.name || `Dealer ${idx + 1}`}
              </h3>
              <button
                onClick={() => removeDealer(idx)}
                className="text-[12px] text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
                  Name
                </label>
                <input
                  value={dealer.name}
                  onChange={(e) => updateDealer(idx, { name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={dealer.accentColor}
                    onChange={(e) => updateDealer(idx, { accentColor: e.target.value })}
                    className="w-10 h-10 rounded-[8px] border border-[#E5E7EB] cursor-pointer"
                  />
                  <input
                    value={dealer.accentColor}
                    onChange={(e) => updateDealer(idx, { accentColor: e.target.value })}
                    className="flex-1 px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
                Logo
              </label>
              <MediaPicker
                value={dealer.logo}
                onChange={(url) => updateDealer(idx, { logo: url })}
                label="Dealer Logo"
                accept="image/*"
              />
            </div>

            <div className="mt-4">
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
                Description
              </label>
              <textarea
                value={dealer.description}
                onChange={(e) => updateDealer(idx, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                value={dealer.tags.join(", ")}
                onChange={(e) =>
                  updateDealer(idx, {
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g. VRF Systems, Multi-Split, Commercial AC"
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
              />
              {dealer.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {dealer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${dealer.accentColor}10`,
                        color: dealer.accentColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-[#111]">Trust Indicators</h2>
          <button
            onClick={addTrustIndicator}
            className="text-[12px] font-semibold text-[#0000B8] hover:underline"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {data.trustIndicators.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                value={item.value}
                onChange={(e) => updateTrustIndicator(idx, "value", e.target.value)}
                placeholder="Value (e.g. 100%)"
                className="w-[100px] px-3 py-2 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
              />
              <input
                value={item.label}
                onChange={(e) => updateTrustIndicator(idx, "label", e.target.value)}
                placeholder="Label (e.g. Genuine Products)"
                className="flex-1 px-3 py-2 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
              />
              <button
                onClick={() => removeTrustIndicator(idx)}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
