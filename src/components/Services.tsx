"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { ServiceItem, ServicesContent } from "@/lib/content";
import { defaultServices } from "@/lib/content";
import { Editable, EditableImage, EditableTags, DragHandle, reorder, useSidebarActions } from "@/components/InlineEdit";

/* ─── Component ─────────────────────────────────── */

export default function Services({ data, editing, onSave }: { data?: ServicesContent; editing?: boolean; onSave?: (data: unknown) => void }) {
  const [content, setContent] = useState<ServicesContent>(data ?? { items: defaultServices });
  const services = content.items;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  useEffect(() => { if (data) setContent(data); }, [data]);
  useEffect(() => { if (editing && onSave) onSave(content); }, [content, editing, onSave]);

  const addService = () => {
    setContent((prev) => ({
      ...prev,
      items: [...prev.items, { id: String(prev.items.length + 1).padStart(2, "0"), title: "New Service", desc: "Description", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80", items: ["Tag"] }],
    }));
  };

  useSidebarActions(
    editing ? [{ type: 'add' as const, label: `Add Service (${services.length})`, onClick: addService }] : [],
    [editing, services.length]
  );

  const updateService = (i: number, field: keyof ServiceItem, val: unknown) => {
    setContent((prev) => ({ ...prev, items: prev.items.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  };

  const moveService = (from: number, to: number) => {
    setContent((prev) => {
      const reordered = reorder(prev.items, from, to);
      // Renumber IDs to match new positions
      const renumbered = reordered.map((s, idx) => ({ ...s, id: String(idx + 1).padStart(2, "0") }));
      return { ...prev, items: renumbered };
    });
    if (active === from) setActive(to);
    else if (active === to) setActive(from);
  };

  // Desktop: always one active (default 0)
  const [active, setActive] = useState(0);
  // Mobile: can be -1 (all collapsed)
  const [mobileOpen, setMobileOpen] = useState<number>(-1);

  const s = services[Math.min(active, services.length - 1)] ?? services[0];

  function toggleMobile(i: number) {
    setMobileOpen((prev) => (prev === i ? -1 : i));
  }

  return (
    <section id="services" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                <Editable value={content.sectionLabel ?? "What we do"} onChange={(v) => setContent((prev) => ({ ...prev, sectionLabel: v }))} tag="span" editing={editing} />
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                <Editable value={content.heading ?? "Comprehensive HVAC"} onChange={(v) => setContent((prev) => ({ ...prev, heading: v }))} tag="span" editing={editing} />
                <br />
                <Editable value={content.headingSub ?? "services."} onChange={(v) => setContent((prev) => ({ ...prev, headingSub: v }))} tag="span" className="text-[var(--color-text-tertiary)]" editing={editing} />
              </h2>
            </div>
            <Editable
              value={content.description ?? "From initial design to long-term care — every layer of your climate infrastructure, handled."}
              onChange={(v) => setContent((prev) => ({ ...prev, description: v }))}
              tag="p"
              className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]"
              multiline
              editing={editing}
            />
          </div>
        </div>

        {/* ── Mobile accordion (hidden on lg+) ── */}
        <div className={`lg:hidden flex flex-col gap-2.5 ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>
          {services.map((item, i) => {
            const isOpen = mobileOpen === i;
            return (
              <div
                key={item.id}
                className={`rounded-[20px] overflow-hidden border transition-all duration-400 ease-[var(--ease)]
                  ${isOpen
                    ? "border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
                    : "border-[var(--color-border)] shadow-none"
                  }`}
              >
                {/* ─ Header / trigger row ─ */}
                <button
                  onClick={() => toggleMobile(i)}
                  className={`group w-full flex items-center gap-4 px-5 py-[18px] text-left
                    transition-colors duration-300 ease-[var(--ease)]
                    ${isOpen
                      ? "bg-[#0000B8]"
                      : "bg-[var(--color-surface)] hover:bg-[var(--color-orange-subtle)]"
                    }`}
                >
                  <span className={`text-[11px] font-bold tracking-[0.06em] shrink-0 w-7 transition-colors duration-300
                    ${isOpen ? "text-white/35" : "text-[var(--color-text-tertiary)]"}`}>
                    {item.id}
                  </span>
                  <span className={`font-[var(--font-display)] text-[16px] font-bold tracking-[-0.02em] flex-1 transition-colors duration-300
                    ${isOpen ? "text-white" : "text-[var(--color-text-primary)] group-hover:text-[#FF7F00]"}`}>
                    {item.title}
                  </span>
                  {/* Chevron */}
                  <svg
                    className={`shrink-0 transition-all duration-400 ease-[var(--ease)]
                      ${isOpen ? "rotate-180 text-white/40" : "rotate-0 text-[var(--color-text-tertiary)]"}`}
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* ─ Expandable panel — grid trick for smooth height ─ */}
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease)]
                    ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    {/* Image panel — flush below the dark header, no gap, no border-radius on top */}
                    <div className="relative h-[260px] bg-[#0000B8]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-80"
                      />
                      {/* Gradient: very thin transparent strip at top (where it connects to the header),
                          then transitions to the dark overlay for the content below */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0000B8]/60 via-transparent to-black/80" />
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
                        <p className="text-[13.5px] text-white/70 leading-[1.75] mb-4">
                          {item.desc}
                        </p>
                        <EditableTags
                          tags={item.items}
                          onChange={(tags) => updateService(i, "items", tags)}
                          editing={editing}
                          containerClassName="flex flex-wrap gap-1.5"
                          tagClassName="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/12 backdrop-blur-sm text-[11.5px] font-medium text-white/75"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop side-by-side panel (hidden on mobile) ── */}
        <div className={`hidden lg:grid lg:grid-cols-[320px_1fr] gap-4 ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>

          {/* Left — service list */}
          <div className="flex flex-col gap-1">
            {services.map((item, i) => (
              <div key={item.id} className="flex items-center gap-1" data-drag-item>
                <DragHandle
                  index={i}
                  listId="services"
                  onReorder={moveService}
                  editing={editing}
                />
                <button
                  onClick={() => setActive(i)}
                  className={`group flex-1 flex items-center gap-4 px-5 py-4 rounded-[16px] text-left
                    transition-all duration-300 ease-[var(--ease)]
                    ${active === i
                      ? "bg-[#0000B8] text-white shadow-[0_8px_24px_rgba(0,0,184,0.22)]"
                      : "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-orange-subtle)] hover:text-[#FF7F00]"
                    }`}
                >
                  <span className={`text-[11px] font-bold tracking-[0.06em] shrink-0 w-7
                    ${active === i ? "text-white/40" : "text-[var(--color-text-tertiary)]"}`}>
                    {item.id}
                  </span>
                  <span className={`text-[14.5px] font-semibold leading-snug
                    ${active === i ? "text-white" : ""}`}>
                    {item.title}
                  </span>
                  <svg
                    className={`ml-auto shrink-0 transition-all duration-300
                      ${active === i ? "opacity-100 translate-x-0 text-white/50" : "opacity-0 -translate-x-1"}`}
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Right — feature panel */}
          <div
            key={active}
            className="relative rounded-[24px] overflow-hidden bg-[#0000B8] min-h-[300px] sm:min-h-[500px]
              flex flex-col justify-end"
            style={{ animation: "svcFadeIn 0.35s ease" }}
          >
            <EditableImage src={s.image} onChange={(v) => updateService(active, "image", v)} editing={editing} className="absolute inset-0">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="800px"
                className="object-cover"
                priority={active === 0}
              />
            </EditableImage>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <span className="absolute top-6 right-7 font-[var(--font-display)] text-[13px] font-bold text-white/25 tracking-[0.06em] z-10">
              {s.id}
            </span>
            <div className="relative z-10 p-8 sm:p-10">
              <Editable value={s.title} onChange={(v) => updateService(active, "title", v)} tag="h3" className="font-[var(--font-display)] text-[26px] sm:text-[32px] font-bold text-white tracking-[-0.02em] leading-tight mb-3" editing={editing} />
              <Editable value={s.desc} onChange={(v) => updateService(active, "desc", v)} tag="p" className="text-[14px] text-white/65 leading-[1.8] max-w-[500px] mb-7" multiline editing={editing} />
              <EditableTags
                tags={s.items}
                onChange={(tags) => updateService(active, "items", tags)}
                editing={editing}
                containerClassName="flex flex-wrap gap-2"
                tagClassName="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/12 backdrop-blur-sm text-[12px] font-medium text-white/75"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes svcFadeIn {
          from { opacity: 0; transform: scale(1.012); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
