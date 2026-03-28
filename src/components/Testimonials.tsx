"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { TestimonialItem } from "@/lib/content";
import { defaultTestimonials } from "@/lib/content";

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials({ data }: { data?: TestimonialItem[] }) {
  const testimonials = data ?? defaultTestimonials;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, 0.05);
  const [active, setActive] = useState(0);
  const [enterFrom, setEnterFrom] = useState<"left" | "right" | null>(null);

  // Touch tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const isAnimating = useRef(false);

  // Direct DOM ref for live-drag transform (avoids re-renders)
  const cardRef = useRef<HTMLDivElement>(null);

  const featured = testimonials[Math.min(active, testimonials.length - 1)] ?? testimonials[0];

  // After active changes: reset the card's inline styles so slide-in animation plays cleanly
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
    const t = setTimeout(() => { isAnimating.current = false; }, 420);
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
    const el = cardRef.current;
    if (el) {
      el.style.transition = "none";
    }
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
      const el = cardRef.current;
      if (el) {
        // Damped drag — feels like resistance
        const damped = dx * 0.42;
        el.style.transform = `translateX(${damped}px)`;
        el.style.opacity = `${Math.max(0.3, 1 - Math.abs(damped) / 160)}`;
      }
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const el = cardRef.current;

    if (isDragging.current && Math.abs(dx) > 40) {
      // Fly out, then navigate
      if (el) {
        el.style.transition = "transform 0.17s ease-out, opacity 0.17s ease-out";
        el.style.transform = `translateX(${dx < 0 ? "-52%" : "52%"})`;
        el.style.opacity = "0";
      }
      isAnimating.current = true;
      setTimeout(() => navigate(dx < 0 ? "next" : "prev"), 170);
    } else {
      // Spring back to resting position
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

  // CSS keyframe animation applied to the new content on each nav
  const contentAnim: React.CSSProperties =
    enterFrom === "right"
      ? { animation: "tsli-from-right 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both" }
      : enterFrom === "left"
      ? { animation: "tsli-from-left 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both" }
      : {};

  return (
    <>
      <style>{`
        @keyframes tsli-from-right {
          from { transform: translateX(56px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes tsli-from-left {
          from { transform: translateX(-56px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      <section id="testimonials" ref={sectionRef} className="py-24 bg-[var(--color-surface-raised)]">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Header */}
          <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
              <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
              Client Testimonials
            </span>
            <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
              Trusted by the
              <br />
              <span className="text-[var(--color-text-tertiary)]">best in Gujarat.</span>
            </h2>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>

            {/* Featured Quote card — ref for live-drag transform */}
            <div
              ref={cardRef}
              className="relative bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[22px] p-9 max-sm:p-7 flex flex-col justify-between min-h-[300px]
                overflow-hidden touch-pan-y select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Content keyed to active — remounts on each nav, triggering slide-in animation */}
              <div key={active} style={contentAnim} className="relative z-10 flex flex-col flex-1">
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
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div
                    className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2"
                    style={{ borderColor: featured.accent }}
                  >
                    <Image src={featured.photo} alt={featured.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">{featured.name}</p>
                    <p className="text-[12.5px] text-[var(--color-text-secondary)]">
                      {featured.role} &middot; {featured.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile: prev / dots / next — outside keyed div so it doesn't animate */}
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
                      className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-5 bg-[var(--color-text-primary)]" : "w-1.5 bg-[var(--color-border-hover)]"}`}
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
                <button
                  key={t.name}
                  onClick={() => {
                    if (isAnimating.current || i === active) return;
                    setEnterFrom(i > active ? "right" : "left");
                    isAnimating.current = true;
                    setActive(i);
                  }}
                  className={`w-full text-left px-5 py-4 rounded-[16px] border flex items-center gap-4
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
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
