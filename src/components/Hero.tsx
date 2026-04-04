"use client";

import Image from "next/image";
import Link from "next/link";
import type { HeroContent } from "@/lib/content";
import { defaultHero } from "@/lib/content";

const avatars = [
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=75", alt: "Rajesh M." },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&q=75", alt: "Priya S." },
  { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=64&q=75", alt: "Vikram P." },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&q=75", alt: "Nisha A." },
  { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&q=75", alt: "Suresh J." },
];

export default function Hero({ data }: { data?: HeroContent }) {
  const d = data ?? defaultHero;
  const stats = d.stats;
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--color-bg)]">
      {/* ── Main content ─────────────────────────────── */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 pt-[88px] sm:pt-[120px] pb-10
                      grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 items-center">

        {/* ── LEFT: Copy ─────────────────────────────── */}
        <div className="flex flex-col">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 bg-[var(--color-surface)]
                          border border-[var(--color-border)] rounded-full text-[12px]
                          text-[var(--color-text-secondary)] mb-8 animate-fade-up">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[var(--color-orange)] animate-[ping_2s_ease-out_infinite] opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-[var(--color-orange)]" />
            </span>
            {d.badge}
          </div>

          {/* Headline */}
          <h1 className="font-[var(--font-display)] font-extrabold leading-[1.0] tracking-[-0.035em]
                         text-[clamp(42px,6vw,76px)] mb-6 animate-fade-up delay-1">
            {d.line1}
            <br />
            <span className="text-[var(--color-text-tertiary)]">{d.line2}</span>
            <br />
            {d.line3}
          </h1>

          {/* Sub */}
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-[1.75] max-w-[420px] mb-10 animate-fade-up delay-2">
            {d.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-12 animate-fade-up delay-3">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full
                         bg-[#0000B8] text-white text-[13.5px] font-semibold
                         transition-all duration-400 ease-[var(--ease)]
                         hover:bg-[#000096] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,184,0.3)]"
            >
              Start a Project
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF7F00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={`tel:${d.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full
                         bg-[var(--color-surface)] text-[var(--color-text-primary)] text-[13.5px] font-semibold
                         border border-[var(--color-border)]
                         transition-all duration-300 ease-[var(--ease)]
                         hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF7F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {d.phone}
            </a>
            <a
              href="https://wa.me/919054190245?text=Hi%2C%20I%27m%20interested%20in%20Shreeji%20HVAC%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full
                         bg-[#25D366] text-white text-[13.5px] font-semibold
                         transition-all duration-300 ease-[var(--ease)]
                         hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(37,211,102,0.4)]"
            >
              <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.469-2.002A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.486-.289-4.99 1.18 1.243-4.836-.317-.497A13.26 13.26 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.274-9.878c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.632-.199-.898.2-.265.398-1.029 1.295-1.261 1.561-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.698.2-.232.266-.398.399-.664.133-.265.066-.497-.033-.697-.1-.199-.898-2.165-1.23-2.963-.325-.778-.655-.672-.898-.685l-.765-.013c-.266 0-.697.1-1.063.497-.365.398-1.394 1.362-1.394 3.321 0 1.96 1.427 3.854 1.626 4.12.2.265 2.807 4.286 6.803 6.01.95.41 1.692.655 2.27.839.954.304 1.822.261 2.508.158.765-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.1-.166-.365-.265-.763-.464z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Social proof avatars */}
          <div className="flex items-center gap-3 animate-fade-up delay-4">
            <div className="flex -space-x-2.5">
              {avatars.map((a, i) => (
                <div key={i} className="relative w-8 h-8 rounded-full border-2 border-[var(--color-bg)] overflow-hidden shrink-0">
                  <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="32px" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FF7F00" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-[12px] text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">500+ clients</span> trust us across Gujarat
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Visuals ──────────────────────────── */}
        <div className="relative hidden lg:block animate-fade-up delay-2">

          {/* Main tall image */}
          <div className="relative h-[580px] rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.13)]">
            <Image
              src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80"
              alt="Commercial HVAC Installation"
              fill
              priority
              sizes="480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Overlay label */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[16px] px-5 py-4">
                <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.06em] mb-1">Latest Project</p>
                <p className="text-[15px] font-bold text-white tracking-[-0.01em]">Surat Diamond Bourse — 480 TR VRF</p>
              </div>
            </div>
          </div>

          {/* Floating badge — top left */}
          <div className="absolute -top-4 -left-6 bg-[var(--color-surface)] border border-[var(--color-border)]
                          rounded-[16px] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.09)]
                          flex items-center gap-3 min-w-[160px]">
            <div className="w-9 h-9 rounded-xl bg-[#0000B8]/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0000B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] leading-none mb-0.5">Response time</p>
              <p className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">&lt; 2 hrs</p>
            </div>
          </div>

          {/* Floating badge — right */}
          <div className="absolute top-1/2 -right-7 -translate-y-1/2 bg-[var(--color-surface)] border border-[var(--color-border)]
                          rounded-[16px] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.09)]
                          flex items-center gap-3 min-w-[150px]">
            <div className="w-9 h-9 rounded-xl bg-[#FF7F00]/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7F00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] leading-none mb-0.5">Satisfaction</p>
              <p className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">98%</p>
            </div>
          </div>

          {/* Floating temperature badge — bottom right */}
          <div className="absolute -bottom-5 -right-5 bg-[#0A0A0A] border border-white/[0.08]
                          rounded-[16px] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.24)]
                          flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4040D0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-white/40 leading-none mb-0.5">Maintained at</p>
              <p className="text-[15px] font-bold text-white tracking-[-0.02em]">21°C ±0.5</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────── */}
      <div className="max-w-[1200px] w-full mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border)] rounded-[20px] overflow-hidden
                        border border-[var(--color-border)] animate-fade-up delay-5">
          {stats.map((s) => (
            <div
              key={s.value}
              className="bg-[var(--color-surface)] px-7 py-6 flex flex-col gap-1
                         transition-colors duration-300 hover:bg-[var(--color-surface-raised)]"
            >
              <span className="font-[var(--font-display)] text-[30px] font-extrabold tracking-[-0.035em] text-[var(--color-text-primary)]">
                {s.value}
              </span>
              <span className="text-[12.5px] text-[var(--color-text-tertiary)]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
