"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceItem, ServicesContent } from "@/lib/content";
import { saveServicesAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";
import MediaPicker from "@/components/MediaPicker";
import { useToast, SaveButton, PageHeader, AddButton, ItemCard, UnsavedBanner } from "../components/AdminUI";

interface Props { initial: ServicesContent; saved: boolean }

export default function ServicesEditor({ initial, saved }: Props) {
  const [services, setServices] = useState<ServiceItem[]>(initial.items);
  const [previewActive, setPreviewActive] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const { toast } = useToast();
  const initialRef = useRef(JSON.stringify(initial.items));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(services) !== initialRef.current);
  }, [services]);

  useEffect(() => {
    if (saved) toast("success", "Services saved successfully");
  }, [saved, toast]);

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

  const moveService = (from: number, to: number) => {
    setServices((s) => {
      const arr = [...s];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  async function handleSave() {
    await saveServicesAction(services);
    initialRef.current = JSON.stringify(services);
    setDirty(false);
    toast("success", "Services saved");
  }

  function handleDiscard() {
    setServices(JSON.parse(initialRef.current));
  }

  const activeService = services[Math.min(previewActive, services.length - 1)] ?? services[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[560px] shrink-0">
        <PageHeader
          title="Services"
          description="Add, remove, or reorder service cards. Drag to reorder."
          badge={dirty ? <span className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">Unsaved</span> : undefined}
          action={<AddButton onClick={addService} label="Add service" />}
        />

        <div className="space-y-4 mb-6">
          {services.map((svc, si) => (
            <ItemCard
              key={svc.id}
              title={svc.title || "Untitled service"}
              onRemove={() => removeService(si)}
              collapsed={collapsed[si]}
              onToggleCollapse={() => setCollapsed((c) => ({ ...c, [si]: !c[si] }))}
              isDragging={dragIdx === si}
              dragHandleProps={{
                draggable: true,
                onDragStart: () => setDragIdx(si),
                onDragOver: (e) => {
                  e.preventDefault();
                  if (dragIdx !== null && dragIdx !== si) {
                    moveService(dragIdx, si);
                    setDragIdx(si);
                  }
                },
                onDragEnd: () => setDragIdx(null),
              }}
            >
              <div className="space-y-4">
                <input
                  className={inp}
                  placeholder="Service title"
                  value={svc.title}
                  onChange={(e) => update(si, "title", e.target.value)}
                />

                <textarea
                  className={ta}
                  placeholder="Description"
                  rows={2}
                  value={svc.desc}
                  onChange={(e) => update(si, "desc", e.target.value)}
                />

                <MediaPicker
                  value={svc.image ?? ""}
                  onChange={(url) => update(si, "image", url)}
                  label="Service Image"
                  dimensions="1200 × 800"
                  aspectRatio="3:2"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11.5px] font-semibold text-[#666]">Feature bullets</span>
                    <button
                      onClick={() => addItem(si)}
                      className="text-[12px] font-semibold text-[#0000B8] hover:text-[#000096] flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                      Add
                    </button>
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
                          className="w-[42px] h-[42px] flex items-center justify-center rounded-[8px] text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ItemCard>
          ))}
        </div>

        <SaveButton onClick={handleSave} hasChanges={dirty} />
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

      {/* Unsaved changes banner */}
      <UnsavedBanner show={dirty} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}

const inp = "h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] w-full focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
const ta  = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] leading-[1.7] resize-y focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
