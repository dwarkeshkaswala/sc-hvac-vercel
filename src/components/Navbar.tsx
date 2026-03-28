"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[1000] px-4 sm:px-6 pointer-events-none">
      <div
        className="mx-auto mt-3 flex items-center justify-between h-[72px] px-7
          max-w-[1280px]
          bg-white/72 backdrop-blur-2xl backdrop-saturate-[1.8]
          border border-[var(--color-border)] rounded-full
          shadow-[0_2px_20px_rgba(0,0,0,0.06)]
          pointer-events-auto"
      >
        {/* Logo */}
        <Link href="#" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Shreeji HVAC & R Trading LLP"
            width={200}
            height={40}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Services", href: "/#services" },
            { label: "Why Us", href: "/#why-us" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/#contact" },
          ].map(({ label, href }) => (
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

        {/* CTA */}
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 h-[50px] px-7 rounded-full whitespace-nowrap
            bg-[var(--color-text-primary)] text-white text-[15px] font-semibold
            transition-all duration-300 ease-[var(--ease)]
            hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          Get a Quote
          <span>→</span>
        </Link>
      </div>
    </nav>
  );
}

