"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { PortfolioContent } from "@/lib/content";
import { defaultPortfolio } from "@/lib/content";
import { Editable, EditableImage, DragHandle, reorder, useSidebarActions } from "@/components/InlineEdit";

export default function Portfolio({ data, editing, onSave }: { data?: PortfolioContent; editing?: boolean; onSave?: (data: unknown) => void }) {
  const [d, setD] = useState<PortfolioContent>(data ?? defaultPortfolio);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.04);

  useEffect(() => { if (data) setD(data); }, [data]);
  useEffect(() => { if (editing && onSave) onSave(d); }, [d, editing, onSave]);

  const addProject = () => {
    setD((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "New Project", category: "Category", scope: "Scope", year: new Date().getFullYear().toString(), image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80", accent: "#0000B8" }],
    }));
  };

  useSidebarActions(
    editing ? [{ type: 'add' as const, label: `Add Project (${d.projects.length})`, onClick: addProject }] : [],
    [editing, d.projects.length]
  );

  const updateProject = (i: number, field: string, val: string) => {
    setD((prev) => ({ ...prev, projects: prev.projects.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));
  };
  const updateStat = (i: number, field: string, val: string) => {
    setD((prev) => ({ ...prev, stats: prev.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  };

  return (
    <section id="portfolio" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                <Editable value={d.sectionLabel ?? "Portfolio"} onChange={(v) => setD((prev) => ({ ...prev, sectionLabel: v }))} tag="span" editing={editing} />
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                <Editable value={d.heading ?? "Projects that speak"} onChange={(v) => setD((prev) => ({ ...prev, heading: v }))} tag="span" editing={editing} />
                <br />
                <Editable value={d.headingSub ?? "for themselves."} onChange={(v) => setD((prev) => ({ ...prev, headingSub: v }))} tag="span" className="text-[var(--color-text-tertiary)]" editing={editing} />
              </h2>
            </div>
            <Editable
              value={d.description ?? "From diamond bourses to cold chains — delivering precision climate engineering across Gujarat."}
              onChange={(v) => setD((prev) => ({ ...prev, description: v }))}
              tag="p"
              className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]"
              multiline
              editing={editing}
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--color-border)] rounded-[18px] overflow-hidden mb-12
          ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>
          {d.stats.map((s, i) => (
            <div key={i} className="bg-[var(--color-surface)] px-6 py-5 flex flex-col gap-0.5" data-drag-item>
              <Editable value={s.value} onChange={(v) => updateStat(i, "value", v)} tag="span" className="font-[var(--font-display)] text-[26px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]" editing={editing} />
              <Editable value={s.label} onChange={(v) => updateStat(i, "label", v)} tag="span" className="text-[12.5px] text-[var(--color-text-secondary)]" editing={editing} />
            </div>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {d.projects.map((p, i) => (
            <div
              key={i}
              data-drag-item
              className={`group relative rounded-[20px] overflow-hidden aspect-[4/3]
                transition-all duration-500 ease-[var(--ease)]
                hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)]
                ${inView ? `animate-fade-up delay-${i + 2}` : "opacity-0"}`}
            >
              {editing && (
                <div className="absolute top-4 right-14 z-20">
                  <DragHandle index={i} listId="portfolio" onReorder={(from, to) => setD((prev) => ({ ...prev, projects: reorder(prev.projects, from, to) }))} editing={editing} />
                </div>
              )}
              <EditableImage
                src={p.image}
                onChange={(v) => updateProject(i, "image", v)}
                editing={editing}
                className="absolute inset-0"
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-105"
                />
              </EditableImage>

              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

              {/* Category chip — top left */}
              <div className="absolute top-4 left-4 z-10">
                <Editable value={p.category} onChange={(v) => updateProject(i, "category", v)} tag="span" className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm bg-white/15 border border-white/25 text-white" editing={editing} />
              </div>

              {/* Year — top right */}
              <Editable value={p.year} onChange={(v) => updateProject(i, "year", v)} tag="span" className="absolute top-4 right-4 text-[11px] font-semibold text-white/40 z-10" editing={editing} />

              {/* Text — bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
                <Editable value={p.scope} onChange={(v) => updateProject(i, "scope", v)} tag="p" className="text-[11.5px] font-medium text-white/50 mb-1 tracking-[0.02em]" editing={editing} />
                <Editable value={p.title} onChange={(v) => updateProject(i, "title", v)} tag="h3" className="font-[var(--font-display)] text-[17px] font-bold text-white tracking-[-0.02em] leading-snug" editing={editing} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
