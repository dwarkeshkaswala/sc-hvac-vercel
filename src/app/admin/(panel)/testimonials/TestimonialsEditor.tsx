"use client";

import { useEffect, useRef, useState } from "react";
import type { TestimonialItem, TestimonialsContent } from "@/lib/content";
import { saveTestimonialsAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";
import MediaPicker from "@/components/MediaPicker";
import { useToast, SaveButton, PageHeader, AddButton, ItemCard, UnsavedBanner } from "../components/AdminUI";

interface Props { initial: TestimonialsContent; saved: boolean }

export default function TestimonialsEditor({ initial, saved }: Props) {
  const [items, setItems] = useState<TestimonialItem[]>(initial.items);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const initialRef = useRef(JSON.stringify(initial.items));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(items) !== initialRef.current);
  }, [items]);

  useEffect(() => {
    if (saved) toast("success", "Testimonials saved successfully");
  }, [saved, toast]);

  // Warn before leaving
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const update = (i: number, field: keyof TestimonialItem, val: string | number) =>
    setItems((s) => {
      const arr = [...s];
      arr[i] = { ...arr[i], [field]: val };
      return arr;
    });

  const add = () =>
    setItems((s) => [
      ...s,
      { name: "", role: "", company: "", photo: "", accent: "#0000B8", rating: 5, quote: "" },
    ]);

  const remove = (i: number) => setItems((s) => s.filter((_, idx) => idx !== i));

  async function handleSave() {
    await saveTestimonialsAction(items);
    initialRef.current = JSON.stringify(items);
    setDirty(false);
    toast("success", "Testimonials saved");
  }

  function handleDiscard() {
    setItems(JSON.parse(initialRef.current));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[560px] shrink-0">
        <PageHeader
          title="Testimonials"
          description="Add or edit client reviews shown on the site."
          badge={dirty ? <span className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">Unsaved</span> : undefined}
          action={<AddButton onClick={add} label="Add review" />}
        />

        <div className="space-y-4 mb-6">
          {items.map((t, i) => (
            <ItemCard
              key={i}
              title={t.name || "Untitled review"}
              onRemove={() => remove(i)}
              collapsed={collapsed[i]}
              onToggleCollapse={() => setCollapsed((c) => ({ ...c, [i]: !c[i] }))}
            >
              <div className="space-y-3">
                <input
                  className={inp}
                  placeholder="Client name"
                  value={t.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <input className={inp} placeholder="Role / Title" value={t.role} onChange={(e) => update(i, "role", e.target.value)} />
                  <input className={inp} placeholder="Company" value={t.company} onChange={(e) => update(i, "company", e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MediaPicker
                    value={t.photo}
                    onChange={(url) => update(i, "photo", url)}
                    label="Photo"
                    dimensions="200 × 200"
                    aspectRatio="1:1"
                  />
                  <div className="flex gap-2 items-center">
                    <input className={`${inp} flex-1`} placeholder="Accent color (#hex)" value={t.accent} onChange={(e) => update(i, "accent", e.target.value)} />
                    <div className="w-[42px] h-[42px] rounded-[8px] border border-[#E5E7EB] shrink-0" style={{ background: t.accent }} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[11.5px] font-semibold text-[#666] whitespace-nowrap">Rating</label>
                  <input
                    type="range" min={1} max={5} step={1}
                    value={t.rating}
                    onChange={(e) => update(i, "rating", Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-[13px] font-bold text-[#111] w-[20px]">{t.rating}</span>
                </div>

                <textarea
                  className={ta}
                  placeholder="Quote text"
                  rows={3}
                  value={t.quote}
                  onChange={(e) => update(i, "quote", e.target.value)}
                />
              </div>
            </ItemCard>
          ))}
        </div>

        <SaveButton onClick={handleSave} hasChanges={dirty} />
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Testimonials">
          <div className="p-4 bg-[#FAFAFA] space-y-3">
            {items.length === 0 ? (
              <p className="text-[11px] text-[#CCC] italic text-center py-8">No reviews yet</p>
            ) : (
              items.map((t, i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  {/* Top row: avatar + name + stars */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    {t.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                        style={{ background: t.accent || "#0000B8" }}
                      >
                        {t.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-bold text-[#111] truncate">
                        {t.name || <span className="italic text-[#DDD]">Name</span>}
                      </p>
                      <p className="text-[9.5px] text-[#999] truncate">
                        {[t.role, t.company].filter(Boolean).join(" · ") || (
                          <span className="italic text-[#DDD]">Role · Company</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={si < (t.rating || 5) ? "#F59E0B" : "#E5E7EB"}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-[10.5px] text-[#555] leading-[1.7] line-clamp-3 italic">
                    &ldquo;{t.quote || <span className="text-[#DDD] not-italic">Quote text…</span>}&rdquo;
                  </p>

                  {/* Accent bar */}
                  <div
                    className="mt-3 h-0.5 w-8 rounded-full"
                    style={{ background: t.accent || "#0000B8" }}
                  />
                </div>
              ))
            )}
          </div>
        </PreviewShell>
      </div>

      {/* Unsaved changes banner */}
      <UnsavedBanner show={dirty} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}

const inp = "h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] w-full focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
const ta  = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] leading-[1.7] resize-y focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
