"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const products = [
  {
    id: "01",
    title: "VRF Systems",
    desc: "Variable Refrigerant Flow systems for large commercial spaces — precise zone control, unmatched energy efficiency.",
    tags: ["Multi-zone", "Heat recovery", "Inverter"],
    accent: "#2563EB",
    image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "02",
    title: "Ducted Systems",
    desc: "Concealed central air systems delivering consistent, quiet comfort across entire floors or buildings.",
    tags: ["Central AHU", "Low noise", "GI ducts"],
    accent: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "03",
    title: "Chillers",
    desc: "Air-cooled and water-cooled chiller plants for large complexes, hospitals, and data centers.",
    tags: ["Screw / Scroll", "High COP", "BMS ready"],
    accent: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "04",
    title: "Room Air Conditioners",
    desc: "Split, cassette, and window AC units from top brands — ideal for offices, retail, and residential use.",
    tags: ["Split / Cassette", "Inverter", "Wi-Fi ready"],
    accent: "#16A34A",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "05",
    title: "Commercial Refrigeration",
    desc: "Refrigeration systems for supermarkets, food-processing units, and pharmaceutical storage.",
    tags: ["Display cases", "Walk-in coolers", "Blast freezers"],
    accent: "#F59E0B",
    image: "https://images.unsplash.com/photo-1567071256-db99fc12c3a0?auto=format&fit=crop&w=900&q=75",
  },
  {
    id: "06",
    title: "Cold Storage",
    desc: "End-to-end cold room design and installation for agri, dairy, pharma, and logistics industries.",
    tags: ["0°C to −40°C", "PUF panels", "HACCP ready"],
    accent: "#EC4899",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=75",
  },
];

export default function Products() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  return (
    <section id="products" ref={ref} className="py-24 bg-[var(--color-surface-raised)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header */}
        <div className={`mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
                <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
                Our Products
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(30px,3.5vw,44px)] font-bold tracking-[-0.03em] leading-[1.1]">
                Premium systems
                <br />
                <span className="text-[var(--color-text-tertiary)]">we supply &amp; install.</span>
              </h2>
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[340px] sm:text-right leading-[1.7]">
              Sourced from world-class brands — DAIKIN, CARRIER, VOLTAS, BLUESTAR, MITSUBISHI — and installed by certified engineers.
            </p>
          </div>
        </div>

        {/* Grid: 3-col desktop, 2-col tablet, 1-col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`group relative bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[20px] overflow-hidden flex flex-col
                transition-all duration-500 ease-[var(--ease)]
                hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.09)]
                hover:border-[var(--color-border-hover)]
                ${inView ? `animate-fade-up delay-${i + 1}` : "opacity-0"}`}
            >
              {/* Image */}
              <div className="relative h-52 shrink-0 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Number badge */}
                <span className="absolute top-4 right-4 font-[var(--font-display)] text-[11px] font-bold text-white/40 tracking-[0.05em]">
                  {p.id}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-white tracking-[-0.02em] leading-snug drop-shadow-sm">
                    {p.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col px-5 py-5">
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-4">
                  {p.desc}
                </p>

                {/* Tags */}
                <div className="mt-auto flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-medium
                        text-[var(--color-text-secondary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
