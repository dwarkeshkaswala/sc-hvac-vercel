"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const projects = [
  {
    title: "Surat Diamond Bourse",
    category: "Commercial",
    scope: "VRF System — 480 TR",
    year: "2024",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=75",
    accent: "#0000B8",
  },
  {
    title: "Industrial Cold Chain Hub",
    category: "Industrial",
    scope: "Cold Storage — 6 chambers",
    year: "2024",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=75",
    accent: "#EC4899",
  },
  {
    title: "Greenfield IT Campus",
    category: "Corporate",
    scope: "Chiller Plant — 320 TR",
    year: "2023",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75",
    accent: "#8B5CF6",
  },
  {
    title: "Lotus Multispecialty Hospital",
    category: "Healthcare",
    scope: "HVAC + HEPA — 180 TR",
    year: "2023",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=75",
    accent: "#16A34A",
  },
  {
    title: "Textile Mill — Surat Unit 3",
    category: "Manufacturing",
    scope: "Ducted Systems — 260 TR",
    year: "2023",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=75",
    accent: "#F59E0B",
  },
  {
    title: "Luxury Residency — Adajan",
    category: "Residential",
    scope: "Split + VRF — 96 TR",
    year: "2022",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=75",
    accent: "#0EA5E9",
  },
];

const stats = [
  { value: "500+", label: "Projects completed" },
  { value: "12+", label: "Years of expertise" },
  { value: "50+", label: "Brands certified" },
  { value: "98%", label: "Client retention" },
];

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.04);

  return (
    <section id="portfolio" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                Portfolio
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                Projects that speak
                <br />
                <span className="text-[var(--color-text-tertiary)]">for themselves.</span>
              </h2>
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]">
              From diamond bourses to cold chains — delivering precision climate engineering across Gujarat.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--color-border)] rounded-[18px] overflow-hidden mb-12
          ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--color-surface)] px-6 py-5 flex flex-col gap-0.5">
              <span className="font-[var(--font-display)] text-[26px] font-bold tracking-[-0.03em] text-[var(--color-text-primary)]">
                {s.value}
              </span>
              <span className="text-[12.5px] text-[var(--color-text-secondary)]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className={`group relative rounded-[20px] overflow-hidden aspect-[4/3]
                transition-all duration-500 ease-[var(--ease)]
                hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)]
                ${inView ? `animate-fade-up delay-${i + 2}` : "opacity-0"}`}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-105"
              />

              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {/* Category chip — top left */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm
                  bg-white/15 border border-white/25 text-white">
                  {p.category}
                </span>
              </div>

              {/* Year — top right */}
              <span className="absolute top-4 right-4 text-[11px] font-semibold text-white/40">
                {p.year}
              </span>

              {/* Text — bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <p className="text-[11.5px] font-medium text-white/50 mb-1 tracking-[0.02em]">{p.scope}</p>
                <h3 className="font-[var(--font-display)] text-[17px] font-bold text-white tracking-[-0.02em] leading-snug">
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
