"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { ServiceItem } from "@/lib/content";
import { defaultServices } from "@/lib/content";

/* ─── Component ───────────────────────────────── */

export default function Services({ data }: { data?: ServiceItem[] }) {
  const services = data ?? defaultServices;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

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
                <span className="w-8 h-px bg-[#FF7F00]" />
                What we do
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                Comprehensive HVAC
                <br />
                <span className="text-[var(--color-text-tertiary)]">services.</span>
              </h2>
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]">
              From initial design to long-term care — every layer of your climate infrastructure, handled.
            </p>
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
                  className={`w-full flex items-center gap-4 px-5 py-[18px] text-left
                    transition-colors duration-300 ease-[var(--ease)]
                    ${isOpen
                      ? "bg-[#0000B8]"
                      : "bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)]"
                    }`}
                >
                  <span className={`text-[11px] font-bold tracking-[0.06em] shrink-0 w-7 transition-colors duration-300
                    ${isOpen ? "text-white/35" : "text-[var(--color-text-tertiary)]"}`}>
                    {item.id}
                  </span>
                  <span className={`font-[var(--font-display)] text-[16px] font-bold tracking-[-0.02em] flex-1 transition-colors duration-300
                    ${isOpen ? "text-white" : "text-[var(--color-text-primary)]"}`}>
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
                    <div className="relative h-[260px] bg-[var(--color-text-primary)]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-80"
                      />
                      {/* Gradient: very thin transparent strip at top (where it connects to the header),
                          then transitions to the dark overlay for the content below */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-text-primary)]/60 via-transparent to-black/80" />
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
                        <p className="text-[13.5px] text-white/70 leading-[1.75] mb-4">
                          {item.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.items.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                bg-white/10 border border-white/12 backdrop-blur-sm
                                text-[11.5px] font-medium text-white/75"
                            >
                              <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                              {tag}
                            </span>
                          ))}
                        </div>
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
              <button
                key={item.id}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-4 px-5 py-4 rounded-[16px] text-left
                  transition-all duration-300 ease-[var(--ease)]
                  ${active === i
                    ? "bg-[#0000B8] text-white shadow-[0_8px_24px_rgba(0,0,184,0.18)]"
                    : "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
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
            ))}
          </div>

          {/* Right — feature panel */}
          <div
            key={active}
            className="relative rounded-[24px] overflow-hidden bg-[var(--color-text-primary)] min-h-[300px] sm:min-h-[500px]
              flex flex-col justify-end"
            style={{ animation: "svcFadeIn 0.35s ease" }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="800px"
              className="object-cover"
              priority={active === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <span className="absolute top-6 right-7 font-[var(--font-display)] text-[13px] font-bold text-white/25 tracking-[0.06em] z-10">
              {s.id}
            </span>
            <div className="relative z-10 p-8 sm:p-10">
              <h3 className="font-[var(--font-display)] text-[26px] sm:text-[32px] font-bold text-white tracking-[-0.02em] leading-tight mb-3">
                {s.title}
              </h3>
              <p className="text-[14px] text-white/65 leading-[1.8] max-w-[500px] mb-7">
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                      bg-white/10 border border-white/12 backdrop-blur-sm
                      text-[12px] font-medium text-white/75"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
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
