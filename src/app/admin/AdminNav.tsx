"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "./actions";

/* ── SVG Icons ───────────────────────────────────────────────── */

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10",
  hero: "M15 3h6v6 M14 10l6.1-6.1 M9 21H3v-6 M10 14l-6.1 6.1",
  navbar: "M3 12h18 M3 6h18 M3 18h18",
  services: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  testimonials: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  trust: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  contact: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  dealers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M12 7a4 4 0 11-8 0 4 4 0 018 0z",
  blog: "M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  media: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z M12 17a4 4 0 100-8 4 4 0 000 8z",
  branding: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68 1.65 1.65 0 0010 3.17V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3",
};

type NavSection = {
  title?: string;
  items: { label: string; href: string; icon: keyof typeof icons }[];
};

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Hero", href: "/admin/hero", icon: "hero" },
      { label: "Services", href: "/admin/services", icon: "services" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
      { label: "Trust / Why Us", href: "/admin/trust", icon: "trust" },
      { label: "Dealers", href: "/admin/dealers", icon: "dealers" },
      { label: "Blog", href: "/admin/blog", icon: "blog" },
    ],
  },
  {
    title: "Site",
    items: [
      { label: "Navbar", href: "/admin/navbar", icon: "navbar" },
      { label: "Contact", href: "/admin/contact", icon: "contact" },
      { label: "Branding", href: "/admin/branding", icon: "branding" },
      { label: "Media", href: "/admin/media", icon: "media" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarInner = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#0000B8] to-[#4444FF] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,184,0.4)]">
            <span className="text-[11px] font-black text-white">SC</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">Shreeji HVAC</p>
            <p className="text-[10px] text-white/30 font-medium">Admin Panel</p>
          </div>
        </Link>
        {/* Close — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[8px] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-1 overflow-y-auto">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-3" : ""}>
            {section.title && (
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/20">
                {section.title}
              </p>
            )}
            {section.items.map(({ label, href, icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-all duration-150 group relative
                    ${active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#4444FF]" />
                  )}
                  <span className={`shrink-0 transition-colors ${active ? "text-[#8888FF]" : "text-white/30 group-hover:text-white/50"}`}>
                    <Icon d={icons[icon]} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-white/[0.06]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium
            text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-150"
        >
          <Icon d={icons.external} className="text-white/30" />
          View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium
              text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150 mt-0.5"
          >
            <Icon d={icons.logout} className="text-white/30" />
            Logout
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#111111] border-b border-white/[0.06] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-[8px] hover:bg-white/[0.08] transition-colors"
          aria-label="Open admin menu"
        >
          <span className="block w-[18px] h-[1.5px] bg-white/60 rounded-full" />
          <span className="block w-[18px] h-[1.5px] bg-white/60 rounded-full" />
          <span className="block w-[18px] h-[1.5px] bg-white/60 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[6px] bg-gradient-to-br from-[#0000B8] to-[#4444FF] flex items-center justify-center">
            <span className="text-[8px] font-black text-white">SC</span>
          </div>
          <p className="text-[13px] font-semibold text-white">Admin</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed drawer on mobile, sticky on desktop */}
      <aside
        className={`
          fixed md:sticky md:top-0 z-50 md:z-auto
          w-[240px] shrink-0 h-screen bg-[#0F0F0F] flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          border-r border-white/[0.04]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {sidebarInner}
      </aside>
    </>
  );
}
