"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "Facility Manager",
    company: "Surat Diamond Bourse",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=75",
    accent: "#2563EB",
    rating: 5,
    quote:
      "Shreeji HVAC handled our 480 TR VRF installation across 4 floors seamlessly. Zero downtime since commissioning — truly professional end-to-end execution.",
  },
  {
    name: "Priya Shah",
    role: "Director of Operations",
    company: "Lotus Multispecialty Hospital",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=75",
    accent: "#16A34A",
    rating: 5,
    quote:
      "Critical environment, zero room for error. Their HEPA-integrated HVAC system meets all NABH standards and their AMC team responds within 2 hours every time.",
  },
  {
    name: "Vikram Patel",
    role: "CEO",
    company: "Patel Cold Chain Logistics",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&q=75",
    accent: "#EC4899",
    rating: 5,
    quote:
      "Six cold chambers, 18 months of flawless operation. Their cold storage expertise and energy-efficient design cut our electricity bills by 22% compared to the previous vendor.",
  },
  {
    name: "Nisha Agarwal",
    role: "Project Head",
    company: "Greenfield IT Campus",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=75",
    accent: "#8B5CF6",
    rating: 5,
    quote:
      "The chiller plant project was delivered 3 weeks ahead of schedule. Their engineering team's attention to load calculation and BMS integration was top-notch.",
  },
  {
    name: "Suresh Joshi",
    role: "Plant Manager",
    company: "Surat Textile Mill",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=75",
    accent: "#F59E0B",
    rating: 5,
    quote:
      "We've been on their AMC plan for 4 years. The team is responsive, thorough, and proactive — our production lines have never had an HVAC-related stoppage.",
  },
  {
    name: "Manav Desai",
    role: "Owner",
    company: "Adajan Luxury Residency",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=75",
    accent: "#0EA5E9",
    rating: 5,
    quote:
      "From design to handover in 6 weeks — exactly as promised. Every apartment's system is whisper-quiet. Residents absolutely love it. Would recommend without hesitation.",
  },
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);
  const [active, setActive] = useState(0);

  const featured = testimonials[active];

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-[var(--color-surface-raised)]">
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

          {/* Featured Quote */}
          <div
            className="relative bg-[var(--color-surface)] border border-[var(--color-border)]
              rounded-[22px] p-9 max-sm:p-7 flex flex-col justify-between min-h-[300px]
              transition-all duration-500 ease-[var(--ease)]"
          >
            {/* Large quote mark */}
            <span
              className="absolute top-6 right-8 font-[var(--font-display)] text-[80px] font-extrabold leading-none select-none"
              style={{ color: `${featured.accent}10` }}
            >
              "
            </span>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: featured.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="font-[var(--font-display)] text-[18px] max-sm:text-[16px] font-semibold tracking-[-0.02em] leading-[1.55] text-[var(--color-text-primary)] mb-8">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: featured.accent }}>
                  <Image src={featured.photo} alt={featured.name} fill className="object-cover" sizes="44px" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">{featured.name}</p>
                  <p className="text-[12.5px] text-[var(--color-text-secondary)]">
                    {featured.role} · {featured.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Selector list */}
          <div className="flex flex-col gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActive(i)}
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
  );
}
