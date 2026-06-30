"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { ProductsContent } from "@/lib/content";
import { defaultProducts } from "@/lib/content";
import { Editable, EditableImage, EditableTags, DragHandle, reorder, useSidebarActions } from "@/components/InlineEdit";

export default function Products({ data, editing, onSave }: { data?: ProductsContent; editing?: boolean; onSave?: (data: unknown) => void }) {
  const [d, setD] = useState<ProductsContent>(data ?? defaultProducts);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  useEffect(() => { if (data) setD(data); }, [data]);
  useEffect(() => { if (editing && onSave) onSave(d); }, [d, editing, onSave]);

  const addItem = () => {
    setD((prev) => ({
      ...prev,
      items: [...prev.items, { id: String(prev.items.length + 1).padStart(2, "0"), title: "New Product", desc: "Product description", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80", tags: ["Tag"], accent: "#0000B8" }],
    }));
  };

  useSidebarActions(
    editing ? [{ type: 'add' as const, label: `Add Product (${d.items.length})`, onClick: addItem }] : [],
    [editing, d.items.length]
  );

  const updateItem = (i: number, field: string, val: unknown) => {
    setD((prev) => ({ ...prev, items: prev.items.map((p, idx) => idx === i ? { ...p, [field]: val } : p) }));
  };
  const moveItem = (from: number, to: number) => {
    setD((prev) => {
      const reordered = reorder(prev.items, from, to);
      const renumbered = reordered.map((p, idx) => ({ ...p, id: String(idx + 1).padStart(2, "0") }));
      return { ...prev, items: renumbered };
    });
  };

  return (
    <section id="products" ref={ref} className="py-24 bg-[var(--color-surface-raised)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                <Editable value={d.sectionLabel ?? "Our Products"} onChange={(v) => setD((prev) => ({ ...prev, sectionLabel: v }))} tag="span" editing={editing} />
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                <Editable value={d.heading ?? "Premium systems"} onChange={(v) => setD((prev) => ({ ...prev, heading: v }))} tag="span" editing={editing} />
                <br />
                <Editable value={d.headingSub ?? "we supply & install."} onChange={(v) => setD((prev) => ({ ...prev, headingSub: v }))} tag="span" className="text-[var(--color-text-tertiary)]" editing={editing} />
              </h2>
            </div>
            <Editable
              value={d.description ?? "Sourced from world-class brands — DAIKIN, CARRIER, VOLTAS, BLUESTAR, MITSUBISHI — and installed by certified engineers."}
              onChange={(v) => setD((prev) => ({ ...prev, description: v }))}
              tag="p"
              className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]"
              multiline
              editing={editing}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {d.items.map((p, i) => (
            <div
              key={i}
              data-drag-item
              className={`group relative bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[20px] overflow-hidden flex flex-col
                transition-all duration-500 ease-[var(--ease)]
                hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.09)]
                hover:border-[var(--color-border-hover)]
                ${inView ? `animate-fade-up delay-${i + 1}` : "opacity-0"}`}
            >
              {editing && (
                <div className="absolute top-3 left-3 z-20">
                  <DragHandle index={i} listId="products" onReorder={moveItem} editing={editing} />
                </div>
              )}
              {/* Image */}
              <div className="relative h-52 shrink-0 overflow-hidden">
                <EditableImage
                  src={p.image}
                  onChange={(v) => updateItem(i, "image", v)}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Number badge */}
                <span className="absolute top-4 right-4 font-[var(--font-display)] text-[11px] font-bold text-white/40 tracking-[0.05em] z-10">
                  {p.id}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
                  <Editable value={p.title} onChange={(v) => updateItem(i, "title", v)} tag="h3" className="font-[var(--font-display)] text-[17px] font-bold text-white tracking-[-0.02em] leading-snug drop-shadow-sm" editing={editing} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col px-5 py-5">
                <Editable value={p.desc} onChange={(v) => updateItem(i, "desc", v)} tag="p" className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-4" multiline editing={editing} />

                {/* Tags */}
                <EditableTags
                  tags={p.tags}
                  onChange={(tags) => updateItem(i, "tags", tags)}
                  editing={editing}
                  containerClassName="mt-auto flex flex-wrap gap-2"
                  tagClassName="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
