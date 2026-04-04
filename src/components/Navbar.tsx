"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Blog", href: "/blog" },
  { label: "Why Us", href: "/#why-us" },
  { label: "Calculator", href: "/tools/heat-load-calculator" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 w-full z-[1000] px-4 sm:px-6 pointer-events-none">
        <div
          className="mx-auto mt-3 flex items-center justify-between h-[60px] sm:h-[72px] px-4 sm:px-7
            max-w-[1280px]
            bg-white/72 backdrop-blur-2xl backdrop-saturate-[1.8]
            border border-[var(--color-border)] rounded-full
            shadow-[0_2px_20px_rgba(0,0,0,0.06)]
            pointer-events-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/logo with contact.svg"
              alt="Shreeji HVAC & R Trading LLP"
              width={240}
              height={48}
              className="h-9 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[15px] font-semibold text-[var(--color-text-primary)] px-4 py-2 rounded-full whitespace-nowrap
                  transition-all duration-250 ease-[var(--ease)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-subtle)]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 h-[44px] sm:h-[50px] px-5 sm:px-7 rounded-full whitespace-nowrap
                bg-[#0000B8] text-white text-[14px] sm:text-[15px] font-semibold
                transition-all duration-300 ease-[var(--ease)]
                hover:bg-[#000096] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,184,0.25)]"
            >
              Get a Quote
              <span className="text-[#FF7F00]">→</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full
                hover:bg-black/5 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`block w-5 h-[1.5px] bg-[var(--color-text-primary)] rounded-full transition-all duration-300 origin-center
                ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-[var(--color-text-primary)] rounded-full transition-all duration-300
                ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-[var(--color-text-primary)] rounded-full transition-all duration-300 origin-center
                ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden pointer-events-auto mx-auto mt-2 max-w-[1280px] overflow-hidden
            rounded-[20px] border bg-white/95 backdrop-blur-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.10)]
            transition-all duration-300 ease-[var(--ease)]
            ${open
              ? "max-h-[480px] opacity-100 border-[var(--color-border)]"
              : "max-h-0 opacity-0 border-transparent pointer-events-none"
            }`}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="text-[15px] font-semibold text-[var(--color-text-primary)] px-4 py-3 rounded-[12px]
                  hover:bg-[var(--color-blue-subtle)] hover:text-[var(--color-blue)] transition-all duration-200"
              >
                {label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 h-[50px] rounded-full
                bg-[#0000B8] text-white text-[15px] font-semibold
                transition-all duration-300 ease-[var(--ease)] hover:bg-[#000096]"
            >
              Get a Quote <span className="text-[#FF7F00]">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Tap-outside overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[999] md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}


