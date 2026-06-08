"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import type { DealersContent } from "@/lib/content";

export default function AuthorizedDealers({ data }: { data: DealersContent }) {
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
            {data.heading}
          </h2>
          <p className="mt-4 text-[15px] text-[var(--color-text-secondary)] max-w-[520px] mx-auto leading-[1.7]">
            {data.subheading}
          </p>
        </div>

        {/* Dealer Cards */}
        <div className={`grid grid-cols-1 ${data.dealers.length >= 2 ? "md:grid-cols-2" : ""} gap-6`}>
          {data.dealers.map((dealer) => (
            <div
              key={dealer.id}
              className="relative rounded-[20px] border border-[var(--color-border)] bg-white p-10 flex flex-col items-center text-center transition-shadow hover:shadow-lg"
            >
              <div className="h-16 w-[200px] flex items-center justify-center mb-6">
                <Image
                  src={dealer.logo}
                  alt={dealer.name}
                  width={200}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] max-w-[320px]">
                {dealer.description}
              </p>
              {dealer.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {dealer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${dealer.accentColor}0D`,
                        color: dealer.accentColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        {data.trustIndicators.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
            {data.trustIndicators.map((item, idx) => (
              <div key={idx}>
                <p className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)]">
                  {item.value}
                </p>
                <p className="text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
