"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "./actions";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Hero", href: "/admin/hero", icon: "◉" },
  { label: "Services", href: "/admin/services", icon: "⊞" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "◎" },
  { label: "Trust / Why Us", href: "/admin/trust", icon: "◇" },
  { label: "Contact", href: "/admin/contact", icon: "◌" },
  { label: "Blog", href: "/admin/blog", icon: "≡" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarInner = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-0.5">Shreeji HVAC</p>
          <p className="text-[13px] font-semibold text-white">Admin Panel</p>
        </div>
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
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200
                ${active
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
                }`}
            >
              <span className="text-[14px] font-bold shrink-0">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.08]">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium
              text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-200"
          >
            <span className="text-[14px]">→</span>
            Logout
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium
            text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-200 mt-0.5"
        >
          <span className="text-[14px]">↗</span>
          View site
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#111111] border-b border-white/[0.08] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-[8px] hover:bg-white/[0.08] transition-colors"
          aria-label="Open admin menu"
        >
          <span className="block w-4 h-[1.5px] bg-white/60 rounded-full" />
          <span className="block w-4 h-[1.5px] bg-white/60 rounded-full" />
          <span className="block w-4 h-[1.5px] bg-white/60 rounded-full" />
        </button>
        <p className="text-[13px] font-semibold text-white">Admin Panel</p>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          w-[220px] shrink-0 min-h-screen bg-[#111111] flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {sidebarInner}
      </aside>
    </>
  );
}
