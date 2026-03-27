"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

/* ─── Data ────────────────────────────────────── */

const services = [
  {
    id: "01",
    title: "Installation & Projects",
    desc: "End-to-end HVAC system design, engineering, and installation for commercial towers, factories, hospitals, and large residential complexes.",
    items: ["VRF / VRV systems", "Central AC plants", "Chiller & AHU units", "Project management"],
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "Repair & Diagnostics",
    desc: "Rapid breakdown response with expert diagnostics covering all major HVAC brands. Our certified engineers reach you within 2 hours.",
    items: ["Emergency callout", "Compressor & PCB repair", "Gas leak detection", "Root cause analysis"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "Annual Maintenance",
    desc: "Structured AMC plans ensuring maximum equipment longevity, peak efficiency, and zero unplanned downtime across your facilities.",
    items: ["Scheduled service visits", "Filter & coil deep clean", "Performance reporting", "Priority response SLA"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "Consultancy & Audit",
    desc: "Expert technical guidance on system sizing, energy efficiency optimisation, and regulatory compliance — before you build or renovate.",
    items: ["Load calculation", "Energy audit & savings report", "Design review", "Compliance advisory"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "Ducting Systems",
    desc: "Custom GI duct fabrication, precision installation, and insulation for optimal airflow distribution across every zone.",
    items: ["GI duct fabrication", "Flexible duct routing", "Insulation wrapping", "Airflow balancing"],
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "06",
    title: "Parts & Supply",
    desc: "Genuine OEM spare parts and components for Carrier, Daikin, Voltas, Bluestar and 40+ other brands — sourced and delivered fast.",
    items: ["OEM spare parts", "Filters & coils", "Controls & sensors", "Same-day dispatch"],
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "07",
    title: "Copper Piping",
    desc: "Professional copper piping runs with silver brazing, nitrogen flushing, and full pressure testing to guarantee leak-free systems.",
    items: ["Copper pipe runs", "Silver brazing", "Nitrogen flushing", "Pressure testing"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80",
  },
];

/* ─── Component ───────────────────────────────── */

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);
  const [active, setActive] = useState(0);

  const s = services[active];

  return (
    <section id="services" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
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

        {/* ── Interactive Panel ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>

          {/* Left — service list */}
          <div className="flex flex-col gap-1">
            {services.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-4 px-5 py-4 rounded-[16px] text-left
                  transition-all duration-300 ease-[var(--ease)]
                  ${active === i
                    ? "bg-[var(--color-text-primary)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
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
            className="relative rounded-[24px] overflow-hidden bg-[var(--color-text-primary)] min-h-[500px]
              flex flex-col justify-end"
            style={{ animation: "svcFadeIn 0.35s ease" }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority={active === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            {/* Number */}
            <span className="absolute top-6 right-7 font-[var(--font-display)] text-[13px] font-bold text-white/25 tracking-[0.06em] z-10">
              {s.id}
            </span>

            {/* Content */}
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
