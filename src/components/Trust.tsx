"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const cards = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Proven Reliability",
    desc: "15+ years serving Gujarat's industrial sector with zero compromise on timelines or quality.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Energy Efficient",
    desc: "Systems designed to reduce power consumption by up to 30%, lowering operational costs significantly.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Dedicated Support",
    desc: "A responsive team available 6 days a week for immediate assistance, emergency repairs, and consultations.",
  },
];

export default function Trust() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.1);

  return (
    <section id="why-us" ref={ref} className="px-6 my-10">
      <div
        className={`max-w-[1200px] mx-auto bg-[var(--color-text-primary)] rounded-[20px] py-[72px] px-16 max-md:px-10 max-sm:px-6 max-sm:py-10 text-white relative overflow-hidden
          ${inView ? "animate-fade-up" : "opacity-0"}`}
      >
        {/* Glow */}
        <div className="absolute -top-1/2 -right-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_70%)] pointer-events-none" />

        {/* Header */}
        <div className="relative mb-14 max-sm:mb-10">
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/40 block mb-4">
            Why Shreeji
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(28px,3vw,38px)] font-bold tracking-[-0.025em] text-white">
            Built on trust,
            <br />
            proven by results.
          </h2>
          <p className="text-white/50 text-sm max-w-[460px] mt-3.5 leading-[1.7]">
            We combine deep technical expertise with an intimate understanding of Surat&apos;s climate and industrial needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] rounded-[14px] overflow-hidden relative">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-[var(--color-text-primary)] p-9 max-sm:p-6 transition-all duration-400 ease-[var(--ease)] hover:bg-[#171717]"
            >
              <div className="w-10 h-10 rounded-[6px] border border-white/10 flex items-center justify-center mb-5 text-white/60 transition-all duration-300 ease-[var(--ease)] group-hover:border-[rgba(37,99,235,0.4)] group-hover:text-[var(--color-blue)]">
                {c.icon}
              </div>
              <h3 className="font-[var(--font-display)] text-base font-bold text-white mb-2">{c.title}</h3>
              <p className="text-[13px] text-white/45 leading-[1.65]">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
