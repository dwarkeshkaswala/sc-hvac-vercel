"use client";

import { useEffect, useRef, useState } from "react";
import type { TrustContent } from "@/lib/content";
import { saveTrustAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";

interface Props {
  initial: TrustContent;
  saved: boolean;
}

export default function TrustEditor({ initial, saved }: Props) {
  const [data, setData] = useState<TrustContent>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");
  const formRef = useRef<HTMLFormElement>(null);

  // clear success msg after 3s
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const updateStat = (i: number, field: "value" | "label", val: string) =>
    setData((d) => {
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...d, stats };
    });

  const updatePillar = (i: number, field: "num" | "title" | "desc", val: string) =>
    setData((d) => {
      const pillars = [...d.pillars];
      pillars[i] = { ...pillars[i], [field]: val };
      return { ...d, pillars };
    });

  const addPillar = () =>
    setData((d) => ({
      ...d,
      pillars: [
        ...d.pillars,
        { num: String(d.pillars.length + 1).padStart(2, "0"), title: "", desc: "" },
      ],
    }));

  const removePillar = (i: number) =>
    setData((d) => ({ ...d, pillars: d.pillars.filter((_, idx) => idx !== i) }));

  async function handleSubmit() {
    await saveTrustAction(data);
    setMsg("Saved!");
  }

  return (
    <div className="flex gap-8 p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-[560px] shrink-0">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Why Us / Trust</h1>
          <p className="text-[13.5px] text-[#666] mt-1">Edit headline stats and trust pillars.</p>
        </div>

        {msg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        {/* Stats */}
        <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-4">
          <h2 className="text-[13px] font-bold text-[#111] mb-4 uppercase tracking-[0.06em]">Headline Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
                <input
                  className={inp}
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold text-[#111] uppercase tracking-[0.06em]">Trust Pillars</h2>
            <button
              type="button"
              onClick={addPillar}
              className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
            >
              + Add pillar
            </button>
          </div>
          <div className="space-y-4">
            {data.pillars.map((p, i) => (
              <div key={i} className="grid grid-cols-[56px_160px_1fr_28px] gap-3 items-start group">
                <input
                  className={`${inp} text-center font-bold`}
                  placeholder="01"
                  value={p.num}
                  onChange={(e) => updatePillar(i, "num", e.target.value)}
                />
                <input
                  className={inp}
                  placeholder="Title"
                  value={p.title}
                  onChange={(e) => updatePillar(i, "title", e.target.value)}
                />
                <input
                  className={inp}
                  placeholder="Description"
                  value={p.desc}
                  onChange={(e) => updatePillar(i, "desc", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removePillar(i)}
                  className="mt-2.5 text-[#ccc] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-[18px] leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        <form ref={formRef} action={handleSubmit}>
          <button
            type="submit"
            className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
          >
            Save changes
          </button>
        </form>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 sticky top-8">
        <PreviewShell label="shreejihvac.com · Why Us">
          <div className="p-5 bg-[#FAFAFA] space-y-4">
            {/* Stats card */}
            <div className="bg-[#EFEFEF] rounded-[16px] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#999] mb-1">By the numbers</p>
              <h3 className="text-[15px] font-bold text-[#111] leading-snug tracking-[-0.02em] mb-4">
                Numbers that<br />speak for us.
              </h3>
              <div className="grid grid-cols-2 gap-px bg-black/[0.07] rounded-[12px] overflow-hidden">
                {data.stats.map((s, i) => (
                  <div key={i} className="bg-[#EFEFEF] px-3 py-3">
                    <p className="text-[20px] font-black tracking-[-0.04em] text-[#111] leading-none mb-0.5">
                      {s.value || <span className="text-[#DDD]">—</span>}
                    </p>
                    <p className="text-[8px] uppercase tracking-[0.07em] text-[#999] font-semibold">
                      {s.label || "Label"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillars grid */}
            <div className="grid grid-cols-2 gap-2">
              {data.pillars.map((p, i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-[12px] p-3 relative overflow-hidden">
                  <span className="absolute -bottom-1 right-2 text-[34px] font-black text-black/[0.04] leading-none select-none">
                    {p.num}
                  </span>
                  <div className="w-6 h-6 rounded-[5px] bg-[#F5F5F5] border border-[#EBEBEB] flex items-center justify-center mb-2 text-[9px] font-bold text-[#AAAAAA]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-[11px] font-bold text-[#111] mb-0.5 leading-tight">
                    {p.title || <span className="text-[#DDD]">Title</span>}
                  </p>
                  <p className="text-[9.5px] text-[#888] leading-[1.55] line-clamp-2">{p.desc}</p>
                </div>
              ))}
              {data.pillars.length === 0 && (
                <p className="col-span-2 text-[11px] text-[#CCC] italic text-center py-4">No pillars yet</p>
              )}
            </div>
          </div>
        </PreviewShell>
      </div>
    </div>
  );
}

const inp =
  "h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] w-full focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";

