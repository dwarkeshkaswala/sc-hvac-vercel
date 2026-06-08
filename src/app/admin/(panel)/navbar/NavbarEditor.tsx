"use client";

import { useState } from "react";
import { saveNavbarAction } from "@/app/admin/actions";
import type { NavbarContent, NavItem } from "@/lib/content";

export default function NavbarEditor({ initial }: { initial: NavbarContent }) {
  const [data, setData] = useState<NavbarContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function updateItem(index: number, updates: Partial<NavItem>) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), label: "", href: "", external: false },
      ],
    }));
  }

  function removeItem(index: number) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function moveItem(from: number, to: number) {
    setData((prev) => {
      const items = [...prev.items];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return { ...prev, items };
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await saveNavbarAction(data);
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
          <h1 className="text-[26px] font-bold text-[#111111] tracking-[-0.02em]">Navbar</h1>
          <p className="text-[14px] text-[#666] mt-1">
            Manage navigation menu items and the call-to-action button.
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

      {/* Menu Items */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-[#111]">Menu Items</h2>
          <button
            onClick={addItem}
            className="text-[12px] font-semibold text-[#0000B8] hover:underline"
          >
            + Add Item
          </button>
        </div>

        <p className="text-[12px] text-[#999] mb-4">Drag items to reorder them.</p>

        <div className="space-y-2">
          {data.items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragIdx !== null && dragIdx !== idx) {
                  moveItem(dragIdx, idx);
                  setDragIdx(idx);
                }
              }}
              onDragEnd={() => setDragIdx(null)}
              className={`flex items-center gap-3 p-3 rounded-[12px] border transition-all ${
                dragIdx === idx
                  ? "border-[#0000B8] bg-[#0000B8]/5"
                  : "border-[#E5E7EB] hover:border-[#CCC]"
              }`}
            >
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-[#BBB] hover:text-[#888] shrink-0 select-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <circle cx="4" cy="3" r="1.2" />
                  <circle cx="10" cy="3" r="1.2" />
                  <circle cx="4" cy="7" r="1.2" />
                  <circle cx="10" cy="7" r="1.2" />
                  <circle cx="4" cy="11" r="1.2" />
                  <circle cx="10" cy="11" r="1.2" />
                </svg>
              </div>

              {/* Label */}
              <input
                value={item.label}
                onChange={(e) => updateItem(idx, { label: e.target.value })}
                placeholder="Label"
                className="w-[120px] px-2.5 py-1.5 rounded-[8px] border border-[#E5E7EB] text-[13px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
              />

              {/* URL */}
              <input
                value={item.href}
                onChange={(e) => updateItem(idx, { href: e.target.value })}
                placeholder="URL (e.g. /blog or https://...)"
                className="flex-1 px-2.5 py-1.5 rounded-[8px] border border-[#E5E7EB] text-[13px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all font-mono"
              />

              {/* External toggle */}
              <label className="flex items-center gap-1.5 text-[11px] text-[#666] shrink-0 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={item.external ?? false}
                  onChange={(e) => updateItem(idx, { external: e.target.checked })}
                  className="w-3.5 h-3.5 rounded accent-[#0000B8]"
                />
                External
              </label>

              {/* Remove */}
              <button
                onClick={() => removeItem(idx)}
                className="w-7 h-7 rounded-[8px] flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {data.items.length === 0 && (
          <p className="text-[13px] text-[#999] text-center py-6">
            No menu items. Click &quot;+ Add Item&quot; to add one.
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-6">
        <h2 className="text-[14px] font-semibold text-[#111] mb-4">Call-to-Action Button</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Button Text
            </label>
            <input
              value={data.ctaLabel}
              onChange={(e) => setData((p) => ({ ...p, ctaLabel: e.target.value }))}
              placeholder="Get a Quote"
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Button Link
            </label>
            <input
              value={data.ctaHref}
              onChange={(e) => setData((p) => ({ ...p, ctaHref: e.target.value }))}
              placeholder="#contact"
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6">
        <h2 className="text-[14px] font-semibold text-[#111] mb-4">Preview</h2>
        <div className="rounded-[12px] border border-[#E5E7EB] px-5 py-3 flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-4">
            {data.items.map((item) => (
              <span key={item.id} className="text-[13px] font-semibold text-[#333]">
                {item.label || "Untitled"}
                {item.external && <span className="text-[10px] text-[#999] ml-0.5">↗</span>}
              </span>
            ))}
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#0000B8] text-white text-[12px] font-semibold">
            {data.ctaLabel || "CTA"}
          </span>
        </div>
      </div>
    </div>
  );
}
