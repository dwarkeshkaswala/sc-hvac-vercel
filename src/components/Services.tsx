"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { ReactNode } from "react";

/* ─── Data ────────────────────────────────────── */

const services = [
  {
    id: "01",
    icon: "building",
    title: "Installation & Projects",
    desc: "End-to-end HVAC system design and installation for commercial, industrial, and residential spaces.",
    items: ["VRF / VRV systems", "Central AC plants", "Chiller & AHU"],
    accent: "#2563EB",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "02",
    icon: "wrench",
    title: "Repair & Diagnostics",
    desc: "Rapid breakdown response and expert diagnostics for all major HVAC brands.",
    items: ["Emergency callout", "Compressor & PCB repair", "Gas leak detection"],
    accent: "#EF4444",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "03",
    icon: "shield",
    title: "Annual Maintenance",
    desc: "Preventive AMC plans ensuring longevity, efficiency, and zero surprise downtime.",
    items: ["Scheduled service visits", "Filter & coil deep clean", "Performance reports"],
    accent: "#16A34A",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "04",
    icon: "lightbulb",
    title: "Consultancy & Audit",
    desc: "Expert guidance on system sizing, energy efficiency, and compliance — before you build.",
    items: ["Load calculation", "Energy audit", "Design review"],
    accent: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "05",
    icon: "wind",
    title: "Ducting Systems",
    desc: "Custom GI duct fabrication, installation, and insulation for optimal airflow across every zone.",
    items: ["GI duct fabrication", "Flex duct routing", "Insulation wrapping"],
    accent: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "06",
    icon: "box",
    title: "Parts Supply",
    desc: "Genuine OEM spare parts and components for Carrier, Daikin, Voltas, Bluestar and more.",
    items: ["OEM spare parts", "Filters & coils", "Controls & sensors"],
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=75",
  },
  {
    id: "07",
    icon: "zap",
    title: "Copper Piping",
    desc: "Professional copper piping, silver brazing, nitrogen flushing, and pressure testing.",
    items: ["Copper pipe runs", "Silver brazing", "Pressure testing"],
    accent: "#EC4899",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=75",
  },
];

/* ─── Icons ───────────────────────────────────── */

const iconMap: Record<string, ReactNode> = {
  building: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  ),
  wrench: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  lightbulb: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  wind: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  ),
  box: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
};

/* ─── Component ───────────────────────────────── */

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  return (
    <section id="services" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section Header */}
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div
              key={s.id}
              className={`group relative bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[20px] overflow-hidden flex flex-col
                transition-all duration-500 ease-[var(--ease)]
                hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.10)]
                hover:border-[var(--color-border-hover)]
                ${inView ? `animate-fade-up delay-${i + 1}` : "opacity-0"}`}
            >
              {/* ── Image zone ── */}
              <div className="relative h-48 overflow-hidden shrink-0">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Accent tint */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-multiply"
                  style={{ background: `linear-gradient(135deg, ${s.accent}80, transparent 60%)` }}
                />

                {/* Service number — top right */}
                <span className="absolute top-4 right-4 font-[var(--font-display)] text-[11px] font-bold text-white/50 tracking-[0.04em]">
                  {s.id}
                </span>

                {/* Icon badge — bottom left, overlapping the fold */}
                <div
                  className="absolute -bottom-5 left-5 w-11 h-11 rounded-[14px] shadow-md flex items-center justify-center
                    border border-white/20 backdrop-blur-sm transition-transform duration-300 ease-[var(--ease)] group-hover:scale-110"
                  style={{ background: s.accent, color: "#fff" }}
                >
                  {iconMap[s.icon]}
                </div>
              </div>

              {/* ── Content zone ── */}
              <div className="flex-1 flex flex-col px-6 pt-10 pb-6">
                <h3 className="font-[var(--font-display)] text-[16.5px] font-bold tracking-[-0.02em] leading-snug mb-2">
                  {s.title}
                </h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-5">
                  {s.desc}
                </p>

                {/* Feature list */}
                <ul className="mt-auto flex flex-col gap-2.5 pt-5 border-t border-[var(--color-border)]">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[12.5px] text-[var(--color-text-secondary)]"
                    >
                      <span
                        className="w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0"
                        style={{ background: `${s.accent}12` }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
