"use client";

import { useEffect, useRef, useState } from "react";
import type { NavbarContent, NavItem } from "@/lib/content";
import { saveNavbarAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";
import { useToast, SaveButton, PageHeader, AddButton, FormCard, UnsavedBanner } from "../components/AdminUI";

interface Props { initial: NavbarContent; saved: boolean }

export default function NavbarEditor({ initial, saved }: Props) {
  const [data, setData] = useState<NavbarContent>(initial);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const { toast } = useToast();
  const initialRef = useRef(JSON.stringify(initial));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(data) !== initialRef.current);
  }, [data]);

  useEffect(() => {
    if (saved) toast("success", "Navbar saved successfully");
  }, [saved, toast]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function updateItem(index: number, updates: Partial<NavItem>) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), label: "", href: "", external: false }],
    }));
  }

  function removeItem(index: number) {
    setData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
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
    await saveNavbarAction(data);
    initialRef.current = JSON.stringify(data);
    setDirty(false);
    toast("success", "Navbar saved");
  }

  function handleDiscard() {
    setData(JSON.parse(initialRef.current));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[560px] shrink-0">
        <PageHeader
          title="Navbar"
          description="Manage navigation menu items and CTA button."
          badge={dirty ? <span className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">Unsaved</span> : undefined}
          action={<AddButton onClick={addItem} label="Add item" />}
        />

        {/* Menu items */}
        <FormCard title="Menu Items" description="Drag to reorder. Toggle 'Ext' for links that open in a new tab.">
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
                className={`flex items-center gap-2 p-2.5 rounded-[10px] border transition-all group ${
                  dragIdx === idx ? "border-[#0000B8] bg-[#0000B8]/5" : "border-[#E5E7EB] hover:border-[#CCC]"
                }`}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-[#CCC] hover:text-[#888] shrink-0 select-none">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="4" cy="3" r="1.2" /><circle cx="10" cy="3" r="1.2" />
                    <circle cx="4" cy="7" r="1.2" /><circle cx="10" cy="7" r="1.2" />
                    <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
                  </svg>
                </div>

                <input
                  className={`${inp} w-[100px]`}
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => updateItem(idx, { label: e.target.value })}
                />
                <input
                  className={`${inp} flex-1 font-mono`}
                  placeholder="/path or https://..."
                  value={item.href}
                  onChange={(e) => updateItem(idx, { href: e.target.value })}
                />
                <label className="flex items-center gap-1 text-[10px] text-[#888] shrink-0 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.external ?? false}
                    onChange={(e) => updateItem(idx, { external: e.target.checked })}
                    className="w-3 h-3 rounded accent-[#0000B8]"
                  />
                  Ext
                </label>
                <button
                  onClick={() => removeItem(idx)}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {data.items.length === 0 && (
            <p className="text-[11px] text-[#CCC] italic text-center py-6">No menu items. Click &quot;Add item&quot; to create one.</p>
          )}
        </FormCard>

        {/* CTA */}
        <FormCard title="Call-to-action Button" description="The primary action button in the navbar">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11.5px] font-semibold text-[#666] mb-1.5">Button Text</p>
              <input
                className={inp}
                placeholder="Get a Quote"
                value={data.ctaLabel}
                onChange={(e) => setData((p) => ({ ...p, ctaLabel: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-[11.5px] font-semibold text-[#666] mb-1.5">Button Link</p>
              <input
                className={`${inp} font-mono`}
                placeholder="#contact"
                value={data.ctaHref}
                onChange={(e) => setData((p) => ({ ...p, ctaHref: e.target.value }))}
              />
            </div>
          </div>
        </FormCard>

        <SaveButton onClick={handleSave} label="Save navbar" hasChanges={dirty} />
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Navbar">
          <div className="p-4 bg-[#FAFAFA]">
            {/* Simulated navbar bar */}
            <div className="bg-white/90 border border-[#E5E7EB] rounded-full px-4 py-2.5 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              {/* Logo placeholder */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded bg-[#0000B8]/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#0000B8]">S</span>
                </div>
                <span className="text-[10px] font-bold text-[#111] tracking-tight">Shreeji</span>
              </div>

              {/* Nav links */}
              <div className="flex items-center gap-1">
                {data.items.map((item) => (
                  <span key={item.id} className="text-[9px] font-semibold text-[#333] px-2 py-1 rounded-full hover:bg-[#FFF5EB] transition-colors whitespace-nowrap">
                    {item.label || <span className="italic text-[#DDD]">…</span>}
                    {item.external && <span className="text-[7px] text-[#BBB] ml-0.5">↗</span>}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <span className="px-3 py-1.5 rounded-full bg-[#0000B8] text-white text-[8.5px] font-semibold shrink-0 whitespace-nowrap">
                {data.ctaLabel || "CTA"} →
              </span>
            </div>

            {/* Mobile preview */}
            <div className="mt-4 mx-auto w-[180px]">
              <p className="text-[8px] text-[#BBB] uppercase tracking-[0.06em] font-bold mb-2 text-center">Mobile menu</p>
              <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                {data.items.map((item) => (
                  <div key={item.id} className="px-3 py-2 border-b border-[#F3F3F3] last:border-0 flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-[#333]">
                      {item.label || <span className="italic text-[#DDD]">Untitled</span>}
                    </span>
                    {item.external && <span className="text-[7px] text-[#BBB]">↗</span>}
                  </div>
                ))}
                <div className="p-2">
                  <div className="rounded-full bg-[#0000B8] text-white text-[8px] font-semibold text-center py-1.5">
                    {data.ctaLabel || "CTA"} →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PreviewShell>
      </div>

      {/* Unsaved changes banner */}
      <UnsavedBanner show={dirty} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}

const inp = "h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] w-full focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
