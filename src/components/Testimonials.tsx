"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { TestimonialItem, TestimonialsContent } from "@/lib/content";
import { defaultTestimonials } from "@/lib/content";
import { Editable, EditableImage, DragHandle, reorder, useSidebarActions } from "@/components/InlineEdit";

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials({ data, editing, onSave }: { data?: TestimonialsContent; editing?: boolean; onSave?: (data: unknown) => void }) {
  const [content, setContent] = useState<TestimonialsContent>(data ?? { items: defaultTestimonials });
  const [testimonials, setTestimonials] = useState(content.items);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, 0.05);
  const [active, setActive] = useState(0);

  useEffect(() => { if (data) { setContent(data); setTestimonials(data.items); } }, [data]);

  const addTestimonial = () => {
    setTestimonials((prev) => [...prev, { name: "New Reviewer", role: "Role", company: "Company", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", accent: "#0000B8", rating: 5, quote: "Testimonial text here." }]);
  };

  useSidebarActions(
    editing ? [{ type: 'add' as const, label: `Add Testimonial (${testimonials.length})`, onClick: addTestimonial }] : [],
    [editing, testimonials.length]
  );
  useEffect(() => { if (editing && onSave) onSave({ ...content, items: testimonials }); }, [testimonials, content, editing, onSave]);

  const updateActive = (field: keyof TestimonialItem, val: string) => {
    setTestimonials((prev) => prev.map((t, i) => i === active ? { ...t, [field]: val } : t));
  };
  const [enterFrom, setEnterFrom] = useState<"left" | "right" | null>(null);

  // Touch tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const isAnimating = useRef(false);

  // dragRef: STABLE div (never remounts) — receives live-drag transform.
  // The keyed inner div handles slide-in animation independently.
  const dragRef = useRef<HTMLDivElement>(null);

  const featured = testimonials[Math.min(active, testimonials.length - 1)] ?? testimonials[0];

  // Reset the stable drag layer before the browser paints the new slide-in content.
  // useLayoutEffect (not useEffect) so there's no frame where dragRef is opacity:0
  // with new content visible inside it.
  useLayoutEffect(() => {
    const el = dragRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
    const t = setTimeout(() => { isAnimating.current = false; }, 400);
    return () => clearTimeout(t);
  }, [active]);

  function navigate(dir: "prev" | "next") {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setEnterFrom(dir === "next" ? "right" : "left");
    setActive((a) =>
      dir === "next"
        ? (a + 1) % testimonials.length
        : (a - 1 + testimonials.length) % testimonials.length
    );
  }

  const prev = () => navigate("prev");
  const next = () => navigate("next");

  function onTouchStart(e: React.TouchEvent) {
    if (isAnimating.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
    const el = dragRef.current;
    if (el) el.style.transition = "none";
  }

  function onTouchMove(e: React.TouchEvent) {
    if (isAnimating.current || touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isDragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      e.preventDefault();
      const el = dragRef.current;
      if (el) {
        const damped = dx * 0.42;
        el.style.transform = `translateX(${damped}px)`;
        el.style.opacity = `${Math.max(0.3, 1 - Math.abs(damped) / 180)}`;
      }
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const el = dragRef.current;

    if (isDragging.current && Math.abs(dx) > 40) {
      // Fly the stable drag layer out, then update active directly after fly-out
      if (el) {
        el.style.transition = "transform 0.16s ease-out, opacity 0.16s ease-out";
        el.style.transform = `translateX(${dx < 0 ? "-55%" : "55%"})`;
        el.style.opacity = "0";
      }
      isAnimating.current = true;
      const dir = dx < 0 ? "next" : "prev";
      setTimeout(() => {
        setEnterFrom(dir === "next" ? "right" : "left");
        setActive((a) =>
          dir === "next"
            ? (a + 1) % testimonials.length
            : (a - 1 + testimonials.length) % testimonials.length
        );
      }, 160);
    } else {
      // Spring back
      if (el) {
        el.style.transition = "transform 0.42s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease";
        el.style.transform = "translateX(0)";
        el.style.opacity = "1";
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;
  }

  // CSS animation for new content sliding in from the correct side
  const contentAnim: React.CSSProperties =
    enterFrom === "right"
      ? { animation: "tsli-from-right 0.32s cubic-bezier(0.25,0.46,0.45,0.94) both" }
      : enterFrom === "left"
      ? { animation: "tsli-from-left 0.32s cubic-bezier(0.25,0.46,0.45,0.94) both" }
      : {};

  return (
    <>
      <style>{`
        @keyframes tsli-from-right {
          from { transform: translateX(48px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes tsli-from-left {
          from { transform: translateX(-48px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      <section id="testimonials" ref={sectionRef} className="py-24 bg-[var(--color-surface-raised)]">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Header */}
          <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
              <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
              <Editable value={content.sectionLabel ?? "Client Testimonials"} onChange={(v) => setContent((prev) => ({ ...prev, sectionLabel: v }))} tag="span" editing={editing} />
            </span>
            <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
              <Editable value={content.heading ?? "Trusted by the"} onChange={(v) => setContent((prev) => ({ ...prev, heading: v }))} tag="span" editing={editing} />
              <br />
              <Editable value={content.headingSub ?? "best in Gujarat."} onChange={(v) => setContent((prev) => ({ ...prev, headingSub: v }))} tag="span" className="text-[var(--color-text-tertiary)]" editing={editing} />
            </h2>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>

            {/* Featured Quote card — card stays completely fixed */}
            <div
              className="relative bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[22px] p-9 max-sm:p-7 flex flex-col justify-between min-h-[300px]
                overflow-hidden touch-pan-y select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/*
                dragRef: stable layer — never remounts, handles live-drag transform.
                Card stays fixed; only this layer moves during drag/fly-out.
              */}
              <div ref={dragRef} className="relative z-10 flex flex-col flex-1">
                {/*
                  Keyed inner div — remounts on every nav, plays slide-in animation.
                  No ref here, no inline style interference.
                */}
                <div key={active} style={contentAnim} className="flex flex-col flex-1">
                  {/* Large quote mark */}
                  <span
                    className="absolute top-0 right-0 font-[var(--font-display)] text-[80px] font-extrabold leading-none select-none pointer-events-none"
                    style={{ color: `${featured.accent}12` }}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-6">
                    {Array.from({ length: featured.rating }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-[var(--font-display)] text-[18px] max-sm:text-[16px] font-semibold tracking-[-0.02em] leading-[1.55] text-[var(--color-text-primary)] mb-8">
                    &ldquo;<Editable value={featured.quote} onChange={(v) => updateActive("quote", v)} tag="span" multiline editing={editing} />&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto">
                    <EditableImage
                      src={featured.photo}
                      onChange={(v) => updateActive("photo", v)}
                      editing={editing}
                      className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2"
                    >
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: featured.accent }}>
                        <Image src={featured.photo} alt={featured.name} fill className="object-cover" sizes="44px" />
                      </div>
                    </EditableImage>
                    <div>
                      <Editable value={featured.name} onChange={(v) => updateActive("name", v)} tag="p" className="text-[14px] font-semibold text-[var(--color-text-primary)]" editing={editing} />
                      <p className="text-[12.5px] text-[var(--color-text-secondary)]">
                        <Editable value={featured.role} onChange={(v) => updateActive("role", v)} tag="span" editing={editing} />
                        {" · "}
                        <Editable value={featured.company} onChange={(v) => updateActive("company", v)} tag="span" editing={editing} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile: prev / dots / next — outside drag layer, always stable */}
              <div className="flex lg:hidden items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center
                    text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-all"
                  aria-label="Previous testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <div className="flex gap-1.5 items-center">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (isAnimating.current) return;
                        setEnterFrom(i > active ? "right" : "left");
                        isAnimating.current = true;
                        setActive(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-5 bg-[#0000B8]" : "w-1.5 bg-[var(--color-border-hover)]"}`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center
                    text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-all"
                  aria-label="Next testimonial"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Selector list — desktop only */}
            <div className="hidden lg:flex flex-col gap-2.5">
              {testimonials.map((t, i) => (
                <div key={t.name} className="flex items-center gap-1" data-drag-item>
                  <DragHandle
                    index={i}
                    listId="testimonials"
                    onReorder={(from, to) => {
                      setTestimonials((prev) => reorder(prev, from, to));
                      if (active === from) setActive(to);
                      else if (active === to) setActive(from);
                    }}
                    editing={editing}
                  />
                  <button
                    onClick={() => {
                      if (isAnimating.current || i === active) return;
                      setEnterFrom(i > active ? "right" : "left");
                      isAnimating.current = true;
                      setActive(i);
                    }}
                    className={`flex-1 text-left px-5 py-4 rounded-[16px] border flex items-center gap-4
                      transition-all duration-300 ease-[var(--ease)]
                      ${active === i
                        ? "bg-[var(--color-surface)] border-[var(--color-border-hover)] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                        : "bg-transparent border-transparent hover:bg-[var(--color-surface)] hover:border-[var(--color-border)]"
                      }`}
                  >
                    <div
                      className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 transition-all duration-300"
                      style={{ border: `2px solid ${active === i ? t.accent : "transparent"}` }}
                    >
                      <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="36px" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[13px] font-semibold truncate transition-colors duration-300 ${active === i ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>
                        {t.name}
                      </p>
                      <p className="text-[11.5px] text-[var(--color-text-tertiary)] truncate">{t.company}</p>
                    </div>
                    {active === i && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: t.accent }}
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
