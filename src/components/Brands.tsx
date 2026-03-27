"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const brands = ["DAIKIN", "CARRIER", "VOLTAS", "BLUESTAR", "MITSUBISHI", "HITACHI"];

export default function Brands() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.2);

  return (
    <section
      id="partners"
      ref={ref}
      className={`py-16 text-center ${inView ? "animate-fade-up" : "opacity-0"}`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] block mb-8">
          Authorized partners
        </span>
        <div className="flex justify-center items-center gap-12 max-sm:gap-7 flex-wrap opacity-30">
          {brands.map((b) => (
            <span
              key={b}
              className="font-[var(--font-display)] text-lg max-sm:text-base font-bold tracking-[-0.02em] text-[var(--color-text-primary)]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
