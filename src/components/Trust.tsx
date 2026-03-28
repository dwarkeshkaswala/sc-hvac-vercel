"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import type { TrustContent } from "@/lib/content";
import { defaultTrust } from "@/lib/content";

/* Pillar icons — ordered by pillar index (cycles if more pillars added) */
const PILLAR_ICONS = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>,
  <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  <svg key="5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
];

export default function Trust({ data }: { data?: TrustContent }) {
  const d = data ?? defaultTrust;
  const stats = d.stats;
  const pillars = d.pillars;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  return (
    <section id="why-us" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                Why Shreeji
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                Built on trust,
                <br />
                <span className="text-[var(--color-text-tertiary)]">proven by results.</span>
              </h2>
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]">
              15 years, zero shortcuts — certified engineering with the accountability of a team that treats every project like our own.
            </p>
          </div>
        </div>

        {/* ── Stats + pillars layout ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>

          {/* Left — gray stats card */}
          <div className="relative bg-[#F2F2F2] rounded-[24px] overflow-hidden flex flex-col justify-between p-9 min-h-[360px]">
            <div className="relative">
              <p className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[var(--color-text-tertiary)] mb-4">By the numbers</p>
              <h3 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--color-text-primary)] leading-snug tracking-[-0.02em]">
                Numbers that
                <br />speak for us.
              </h3>
            </div>

            <div className="relative grid grid-cols-2 gap-px bg-black/[0.06] rounded-[16px] overflow-hidden mt-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#F2F2F2] px-5 py-5">
                  <p className="font-[var(--font-display)] text-[30px] font-black tracking-[-0.04em] text-[var(--color-text-primary)] leading-none mb-1">{s.value}</p>
                  <p className="text-[10.5px] text-[var(--color-text-tertiary)] font-semibold uppercase tracking-[0.07em]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — pillars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="group relative bg-[var(--color-surface)] border border-[var(--color-border)]
                  rounded-[20px] p-6 overflow-hidden
                  transition-all duration-400 ease-[var(--ease)]
                  hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)] hover:border-[var(--color-border-hover)]"
              >
                {/* watermark number */}
                <span className="absolute -bottom-2 right-4 font-[var(--font-display)] text-[72px] font-black
                  leading-none select-none pointer-events-none text-black/[0.04]
                  transition-colors duration-400 group-hover:text-black/[0.06]">
                  {p.num}
                </span>

                <div className="relative">
                  <div className="w-10 h-10 rounded-[10px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]
                    flex items-center justify-center mb-4 text-[var(--color-text-secondary)]
                    transition-all duration-300 group-hover:bg-[#111111] group-hover:text-white group-hover:border-transparent">
                    {PILLAR_ICONS[pillars.indexOf(p) % PILLAR_ICONS.length]}
                  </div>
                  <h3 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.015em] mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-[1.7]">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
