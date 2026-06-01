"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

export default function AuthorizedDealers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.2);

  return (
    <section
      id="authorized-dealers"
      ref={ref}
      className={`py-24 bg-[var(--color-bg)] ${inView ? "animate-fade-up" : "opacity-0"}`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
            <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
            Official Partners
            <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-0.03em] leading-[1.1]">
            Authorised Dealers of
          </h2>
          <p className="mt-4 text-[15px] text-[var(--color-text-secondary)] max-w-[520px] mx-auto leading-[1.7]">
            We are proud authorised dealers of Toshiba and Carrier — delivering genuine products, certified installation, and manufacturer-backed warranty.
          </p>
        </div>

        {/* Dealer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Toshiba */}
          <div className="relative rounded-[20px] border border-[var(--color-border)] bg-white p-10 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
            <div className="h-16 w-[200px] flex items-center justify-center mb-6">
              <Image
                src="/toshiba-logo.svg"
                alt="Toshiba"
                width={200}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] max-w-[320px]">
              Authorised dealer for Toshiba HVAC systems — VRF solutions, multi-split systems, and commercial air conditioning with Japanese engineering excellence.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#E31837]/5 text-[#E31837]">VRF Systems</span>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#E31837]/5 text-[#E31837]">Multi-Split</span>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#E31837]/5 text-[#E31837]">Commercial AC</span>
            </div>
          </div>

          {/* Carrier */}
          <div className="relative rounded-[20px] border border-[var(--color-border)] bg-white p-10 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
            <div className="h-16 w-[200px] flex items-center justify-center mb-6">
              <Image
                src="/carrier-logo.svg"
                alt="Carrier"
                width={200}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] max-w-[320px]">
              Authorised dealer for Carrier — the world leader in heating, air conditioning, and refrigeration solutions for residential and commercial spaces.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#0055A4]/5 text-[#0055A4]">Ducted Systems</span>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#0055A4]/5 text-[#0055A4]">Chillers</span>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#0055A4]/5 text-[#0055A4]">AHU</span>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)]">100%</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em]">Genuine Products</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)]">Certified</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em]">Installation Team</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)]">Full</p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em]">Manufacturer Warranty</p>
          </div>
        </div>
      </div>
    </section>
  );
}
