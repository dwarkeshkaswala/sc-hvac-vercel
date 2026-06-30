"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { DealersContent } from "@/lib/content";
import { Editable, EditableImage, EditableTags, DragHandle, reorder, useSidebarActions } from "@/components/InlineEdit";

export default function AuthorizedDealers({ data, editing, onSave }: { data: DealersContent; editing?: boolean; onSave?: (data: unknown) => void }) {
  const [d, setD] = useState(data);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.2);

  useEffect(() => { setD(data); }, [data]);
  useEffect(() => { if (editing && onSave) onSave(d); }, [d, editing, onSave]);

  const addDealer = () => {
    setD((prev) => ({
      ...prev,
      dealers: [...prev.dealers, { id: crypto.randomUUID(), name: "New Dealer", logo: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=200&q=80", description: "Dealer description", tags: ["Tag"], accentColor: "#0000B8" }],
    }));
  };

  useSidebarActions(
    editing ? [{ type: 'add' as const, label: `Add Dealer (${d.dealers.length})`, onClick: addDealer }] : [],
    [editing, d.dealers.length]
  );

  return (
    <section
      id="authorized-dealers"
      ref={ref}
      className={`py-24 bg-[var(--color-bg)] ${inView ? "animate-fade-up" : "opacity-0"}`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
            <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
            <Editable value={d.sectionLabel ?? "Official Partners"} onChange={(v) => setD((prev) => ({ ...prev, sectionLabel: v }))} tag="span" editing={editing} />
            <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
          </span>
          <Editable value={d.heading} onChange={(v) => setD((prev) => ({ ...prev, heading: v }))} tag="h2" className="font-[var(--font-display)] text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-0.03em] leading-[1.1]" editing={editing} />
          <Editable value={d.subheading} onChange={(v) => setD((prev) => ({ ...prev, subheading: v }))} tag="p" className="mt-4 text-[15px] text-[var(--color-text-secondary)] max-w-[520px] mx-auto leading-[1.7]" multiline editing={editing} />
        </div>

        {/* Dealer Cards */}
        <div className={`grid grid-cols-1 ${d.dealers.length >= 2 ? "md:grid-cols-2" : ""} gap-6`}>
          {d.dealers.map((dealer, i) => (
            <div
              key={dealer.id}
              data-drag-item
              className="relative rounded-[20px] border border-[var(--color-border)] bg-white p-10 flex flex-col items-center text-center transition-shadow hover:shadow-lg"
            >
              {editing && (
                <div className="absolute top-3 right-3 z-10">
                  <DragHandle index={i} listId="dealers" onReorder={(from, to) => setD((prev) => ({ ...prev, dealers: reorder(prev.dealers, from, to) }))} editing={editing} />
                </div>
              )}
              <EditableImage
                src={dealer.logo}
                onChange={(v) => setD((prev) => ({ ...prev, dealers: prev.dealers.map((dlr, idx) => idx === i ? { ...dlr, logo: v } : dlr) }))}
                editing={editing}
                className="h-16 w-[200px] flex items-center justify-center mb-6"
              >
                <Image
                  src={dealer.logo}
                  alt={dealer.name}
                  width={200}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </EditableImage>
              <Editable
                value={dealer.description}
                onChange={(v) => setD((prev) => ({ ...prev, dealers: prev.dealers.map((dlr, idx) => idx === i ? { ...dlr, description: v } : dlr) }))}
                tag="p"
                className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] max-w-[320px]"
                multiline
                editing={editing}
              />
              <div className="mt-6">
                <EditableTags
                  tags={dealer.tags}
                  onChange={(tags) => setD((prev) => ({ ...prev, dealers: prev.dealers.map((dlr, idx) => idx === i ? { ...dlr, tags } : dlr) }))}
                  editing={editing}
                  containerClassName="flex flex-wrap justify-center gap-2"
                  tagClassName="text-[11px] font-medium px-3 py-1 rounded-full"
                  accentColor={dealer.accentColor}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        {d.trustIndicators.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
            {d.trustIndicators.map((item, idx) => (
              <div key={idx}>
                <Editable value={item.value} onChange={(v) => setD((prev) => ({ ...prev, trustIndicators: prev.trustIndicators.map((ti, i) => i === idx ? { ...ti, value: v } : ti) }))} tag="p" className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)]" editing={editing} />
                <Editable value={item.label} onChange={(v) => setD((prev) => ({ ...prev, trustIndicators: prev.trustIndicators.map((ti, i) => i === idx ? { ...ti, label: v } : ti) }))} tag="p" className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em]" editing={editing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
