"use client";

import { useEffect, useState } from "react";
import type { TestimonialItem } from "@/lib/content";
import { saveTestimonialsAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";

interface Props { initial: TestimonialItem[]; saved: boolean }

export default function TestimonialsEditor({ initial, saved }: Props) {
  const [items, setItems] = useState<TestimonialItem[]>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const update = (i: number, field: keyof TestimonialItem, val: string | number) =>
    setItems((s) => {
      const arr = [...s];
      arr[i] = { ...arr[i], [field]: val };
      return arr;
    });

  const add = () =>
    setItems((s) => [
      ...s,
      { name: "", role: "", company: "", photo: "", accent: "#2563EB", rating: 5, quote: "" },
    ]);

  const remove = (i: number) => setItems((s) => s.filter((_, idx) => idx !== i));

  async function handleSave() {
    await saveTestimonialsAction(items);
    setMsg("Saved!");
  }

  return (
    <div className="flex gap-8 p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-[560px] shrink-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Testimonials</h1>
            <p className="text-[13.5px] text-[#666] mt-1">Add or edit client reviews shown on the site.</p>
          </div>
          <button onClick={add} className="h-[38px] px-5 rounded-[10px] bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-all">
            + Add review
          </button>
        </div>

        {msg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {items.map((t, i) => (
            <div key={i} className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <input
                  className={`${inp} flex-1`}
                  placeholder="Client name"
                  value={t.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                />
                <button
                  onClick={() => remove(i)}
                  className="mt-2 text-[#ccc] hover:text-red-400 transition-colors text-[20px] leading-none"
                >×</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inp} placeholder="Role / Title" value={t.role} onChange={(e) => update(i, "role", e.target.value)} />
                <input className={inp} placeholder="Company" value={t.company} onChange={(e) => update(i, "company", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inp} placeholder="Photo URL" value={t.photo} onChange={(e) => update(i, "photo", e.target.value)} />
                <div className="flex gap-2 items-center">
                  <input className={`${inp} flex-1`} placeholder="Accent color (#hex)" value={t.accent} onChange={(e) => update(i, "accent", e.target.value)} />
                  <div className="w-[38px] h-[38px] rounded-[8px] border border-[#E5E7EB] shrink-0" style={{ background: t.accent }} />
                </div>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] whitespace-nowrap">Rating</label>
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
          ))}
        </div>

        <button
          onClick={handleSave}
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
        >
          Save all testimonials
        </button>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 sticky top-8">
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
                        style={{ background: t.accent || "#2563EB" }}
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
                    style={{ background: t.accent || "#2563EB" }}
                  />
                </div>
              ))
            )}
          </div>
        </PreviewShell>
      </div>
    </div>
  );
}

const inp = "h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] w-full focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";
const ta  = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] leading-[1.7] resize-y focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";

