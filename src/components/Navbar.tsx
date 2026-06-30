"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NavbarContent } from "@/lib/content";
import { defaultNavbar } from "@/lib/content";
import { useInlineEdit } from "@/components/InlineEdit";

export default function Navbar({ data = defaultNavbar }: { data?: NavbarContent }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { sidebarOpen } = useInlineEdit();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDropdownOpen(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 150);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 z-[1000] px-4 sm:px-6 pointer-events-none transition-all duration-300 ease-out ${sidebarOpen ? 'right-[300px]' : 'right-0'}`}>
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
            {data.items.map(({ id, label, href, external, children }) => (
              <div
                key={id}
                className="relative"
                onMouseEnter={() => children?.length ? handleMouseEnter(id) : undefined}
                onMouseLeave={children?.length ? handleMouseLeave : undefined}
              >
                <Link
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1 text-[15px] font-semibold text-[var(--color-text-primary)] px-4 py-2 rounded-full whitespace-nowrap
                    transition-all duration-250 ease-[var(--ease)] hover:text-[#FF7F00] hover:bg-[var(--color-orange-subtle)]"
                >
                  {label}
                  {children && children.length > 0 && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform duration-200 ${dropdownOpen === id ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {children && children.length > 0 && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200
                      ${dropdownOpen === id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  >
                    <div className="w-[260px] max-h-[400px] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-[16px] border border-[var(--color-border)] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="block px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[var(--color-text-primary)]
                            hover:bg-[var(--color-orange-subtle)] hover:text-[#FF7F00] transition-all duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                      <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                        <Link
                          href={href}
                          className="block px-3 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#0000B8]
                            hover:bg-blue-50 transition-all duration-150"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link
              href={data.ctaHref}
              className="hidden sm:inline-flex items-center gap-2 h-[44px] sm:h-[50px] px-5 sm:px-7 rounded-full whitespace-nowrap
                bg-[#0000B8] text-white text-[14px] sm:text-[15px] font-semibold
                transition-all duration-300 ease-[var(--ease)]
                hover:bg-[#FF7F00] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,127,0,0.35)]"
            >
              {data.ctaLabel}
              <span>→</span>
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
              ? "max-h-[600px] opacity-100 border-[var(--color-border)]"
              : "max-h-0 opacity-0 border-transparent pointer-events-none"
            }`}
        >
          <div className="px-4 py-4 flex flex-col gap-1 max-h-[500px] overflow-y-auto">
            {data.items.map(({ id, label, href, external, children }) => (
              <div key={id}>
                {children && children.length > 0 ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === id ? null : id)}
                      className="w-full flex items-center justify-between text-[15px] font-semibold text-[var(--color-text-primary)] px-4 py-3 rounded-[12px]
                        hover:bg-[var(--color-orange-subtle)] hover:text-[#FF7F00] transition-all duration-200"
                    >
                      {label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform duration-200 ${mobileExpanded === id ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-4 pb-2 flex flex-col gap-0.5">
                        {children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="text-[13px] font-medium text-[var(--color-text-secondary)] px-4 py-2.5 rounded-[10px]
                              hover:bg-[var(--color-orange-subtle)] hover:text-[#FF7F00] transition-all duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className="text-[13px] font-semibold text-[#0000B8] px-4 py-2.5 rounded-[10px]
                            hover:bg-blue-50 transition-all duration-150"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                    className="text-[15px] font-semibold text-[var(--color-text-primary)] px-4 py-3 rounded-[12px]
                      hover:bg-[var(--color-orange-subtle)] hover:text-[#FF7F00] transition-all duration-200"
                  >
                    {label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href={data.ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 h-[50px] rounded-full
                bg-[#0000B8] text-white text-[15px] font-semibold
                transition-all duration-300 ease-[var(--ease)] hover:bg-[#FF7F00]"
            >
              {data.ctaLabel} →
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


