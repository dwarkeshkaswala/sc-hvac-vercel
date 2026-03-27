"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-[1000] px-4 sm:px-6 pointer-events-none">
      <div
        className={`mx-auto mt-3 flex items-center h-[58px] px-5
          bg-white/72 backdrop-blur-2xl backdrop-saturate-[1.8] border border-[var(--color-border)] rounded-full
          pointer-events-auto
          transition-all duration-500 ease-[var(--ease)]
          ${scrolled
            ? "max-w-[1280px] justify-between shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-black/[0.08] pr-1.5"
            : "max-w-[280px] justify-center shadow-none"
          }`}
      >
        {/* Logo — always visible, centered when collapsed */}
        <Link href="#" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Shreeji HVAC & R Trading LLP"
            width={200}
            height={40}
            className={`w-auto object-contain transition-all duration-500 ease-[var(--ease)] ${scrolled ? "h-9" : "h-12"}`}
            priority
          />
        </Link>

        {/* Nav links — slide in on scroll */}
        <div
          className={`hidden md:flex items-center gap-1 transition-all duration-500 ease-[var(--ease)] overflow-hidden
            ${scrolled ? "max-w-[400px] opacity-100 ml-6" : "max-w-0 opacity-0 ml-0"}`}
        >
          {["Services", "Why Us", "Partners", "Contact"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              className="text-[13px] font-semibold text-[var(--color-text-primary)] px-3.5 py-1.5 rounded-full whitespace-nowrap
                transition-all duration-250 ease-[var(--ease)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-subtle)]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA — slide in on scroll */}
        <div
          className={`transition-all duration-500 ease-[var(--ease)] overflow-hidden
            ${scrolled ? "max-w-[200px] opacity-100 ml-auto" : "max-w-0 opacity-0"}`}
        >
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 h-[42px] px-5 rounded-full whitespace-nowrap
              bg-[var(--color-text-primary)] text-white text-[13px] font-medium
              transition-all duration-300 ease-[var(--ease)]
              hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
          >
            Get a Quote
            <span className="transition-transform duration-300 ease-[var(--ease)]">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
