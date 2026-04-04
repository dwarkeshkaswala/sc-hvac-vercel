"use client";

import { useEffect, useState } from "react";
import type { ServiceItem } from "@/lib/content";
import { saveServicesAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";

interface Props { initial: ServiceItem[]; saved: boolean }

export default function ServicesEditor({ initial, saved }: Props) {
  const [services, setServices] = useState<ServiceItem[]>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");
  const [previewActive, setPreviewActive] = useState(0);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const update = (i: number, field: keyof ServiceItem, val: unknown) =>
    setServices((s) => {
      const arr = [...s];
      arr[i] = { ...arr[i], [field]: val };
      return arr;
    });

  const updateItem = (si: number, ii: number, val: string) =>
    setServices((s) => {
      const arr = [...s];
      const items = [...(arr[si].items ?? [])];
      items[ii] = val;
      arr[si] = { ...arr[si], items };
      return arr;
    });

  const addItem = (si: number) =>
    setServices((s) => {
      const arr = [...s];
      arr[si] = { ...arr[si], items: [...(arr[si].items ?? []), ""] };
      return arr;
    });

  const removeItem = (si: number, ii: number) =>
    setServices((s) => {
      const arr = [...s];
      const items = (arr[si].items ?? []).filter((_, idx) => idx !== ii);
      arr[si] = { ...arr[si], items };
      return arr;
    });

  const addService = () =>
    setServices((s) => [
      ...s,
      { id: `service-${Date.now()}`, title: "", desc: "", items: [], image: "" },
    ]);

  const removeService = (i: number) =>
    setServices((s) => s.filter((_, idx) => idx !== i));

  async function handleSave() {
    await saveServicesAction(services);
    setMsg("Saved!");
  }

  const activeService = services[Math.min(previewActive, services.length - 1)] ?? services[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[560px] shrink-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Services</h1>
            <p className="text-[13.5px] text-[#666] mt-1">Add, remove, or edit service cards.</p>
          </div>
          <button onClick={addService} className="h-[38px] px-5 rounded-[10px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] transition-all">
            + Add service
          </button>
        </div>

        {msg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {services.map((svc, si) => (
            <div key={svc.id} className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <input
                  className={`${inp} flex-1`}
                  placeholder="Service title"
                  value={svc.title}
                  onChange={(e) => update(si, "title", e.target.value)}
                />
                <button
                  onClick={() => removeService(si)}
                  className="mt-2 text-[#ccc] hover:text-red-400 transition-colors text-[20px] leading-none"
                >×</button>
              </div>

              <textarea
                className={`${ta} mb-4`}
                placeholder="Description"
                rows={2}
                value={svc.desc}
                onChange={(e) => update(si, "desc", e.target.value)}
              />

              <input
                className={`${inp} mb-4`}
                placeholder="Image URL (e.g. /images/ac.jpg)"
                value={svc.image ?? ""}
                onChange={(e) => update(si, "image", e.target.value)}
              />

              <div className="mb-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999]">Feature bullets</span>
                  <button
                    onClick={() => addItem(si)}
                    className="text-[12px] font-semibold text-[#0000B8] hover:text-[#000096]"
                  >+ Add</button>
                </div>
                <div className="space-y-2">
                  {(svc.items ?? []).map((item, ii) => (
                    <div key={ii} className="flex gap-2 group">
                      <input
                        className={`${inp} flex-1`}
                        placeholder="Feature"
                        value={item}
                        onChange={(e) => updateItem(si, ii, e.target.value)}
                      />
                      <button
                        onClick={() => removeItem(si, ii)}
                        className="text-[#ccc] hover:text-red-400 transition-colors text-[18px] leading-none opacity-0 group-hover:opacity-100"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
        >
          Save all services
        </button>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Services">
          <div className="p-5 bg-[#FAFAFA]">
            {services.length === 0 ? (
              <p className="text-[11px] text-[#CCC] italic text-center py-8">No services yet</p>
            ) : (
              <div className="flex gap-3">
                {/* Left: service tab list */}
                <div className="w-[130px] shrink-0 space-y-1">
                  {services.map((svc, i) => (
                    <button
                      key={svc.id}
                      onClick={() => setPreviewActive(i)}
                      className={`w-full text-left px-3 py-2 rounded-[10px] text-[11px] transition-all ${
                        previewActive === i
                          ? "bg-[#111] text-white font-semibold"
                          : "text-[#666] hover:bg-white hover:text-[#111]"
                      }`}
                    >
                      <span className={`block text-[8.5px] font-bold tracking-[0.06em] mb-0.5 ${previewActive === i ? "text-white/40" : "text-[#BBB]"}`}>
                        {svc.id}
                      </span>
                      <span className="line-clamp-2 leading-tight">
                        {svc.title || <span className="italic text-[#CCC]">Untitled</span>}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right: selected service detail */}
                {activeService && (
                  <div className="flex-1 bg-[#111] rounded-[14px] min-h-[220px] relative overflow-hidden flex flex-col justify-end">
                    {activeService.image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-25"
                        style={{ backgroundImage: `url(${activeService.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                    <div className="relative z-10 p-4">
                      <p className="text-[16px] font-bold text-white leading-tight mb-1">
                        {activeService.title || <span className="text-white/30 italic">Untitled</span>}
                      </p>
                      <p className="text-[9.5px] text-white/55 leading-[1.7] mb-2.5 line-clamp-2">
                        {activeService.desc}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(activeService.items ?? []).slice(0, 4).map((item, ii) => (
                          <span
                            key={ii}
                            className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[8.5px] text-white/65"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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

