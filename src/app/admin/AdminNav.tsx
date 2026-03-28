"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <aside className="w-[220px] shrink-0 min-h-screen bg-[#111111] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.08]">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-0.5">Shreeji HVAC</p>
        <p className="text-[13px] font-semibold text-white">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
