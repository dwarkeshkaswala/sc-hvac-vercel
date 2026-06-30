import Link from "next/link";
import { getBlogPosts, getServicesContent, getTestimonialsContent } from "@/lib/content";

const sections = [
  { label: "Hero Section", href: "/admin/hero", desc: "Headline, stats, phone number", icon: "M15 3h6v6 M14 10l6.1-6.1 M9 21H3v-6 M10 14l-6.1 6.1", color: "#6366F1" },
  { label: "Services", href: "/admin/services", desc: "Add, edit, or remove services", icon: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z", color: "#F59E0B" },
  { label: "Testimonials", href: "/admin/testimonials", desc: "Client quotes and photos", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z", color: "#10B981" },
  { label: "Trust / Why Us", href: "/admin/trust", desc: "Stats and pillar cards", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", color: "#3B82F6" },
  { label: "Authorised Dealers", href: "/admin/dealers", desc: "Dealer logos, descriptions, tags", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M12 7a4 4 0 11-8 0 4 4 0 018 0z", color: "#8B5CF6" },
  { label: "Blog Posts", href: "/admin/blog", desc: "Create, edit, delete articles", icon: "M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z", color: "#EC4899" },
  { label: "Navbar", href: "/admin/navbar", desc: "Menu items, links, CTA button", icon: "M3 12h18 M3 6h18 M3 18h18", color: "#64748B" },
  { label: "Contact Info", href: "/admin/contact", desc: "Phone, email, address, hours", icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z", color: "#14B8A6" },
  { label: "Media Files", href: "/admin/media", desc: "Upload and manage images, videos", icon: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z M12 17a4 4 0 100-8 4 4 0 000 8z", color: "#F97316" },
  { label: "Branding", href: "/admin/branding", desc: "Logo, favicon, colors, site identity", icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5", color: "#0EA5E9" },
  { label: "Settings", href: "/admin/settings", desc: "Change password, account settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68 1.65 1.65 0 0010 3.17V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z", color: "#78716C" },
];

export default async function AdminDashboard() {
  const [posts, services, testimonials] = await Promise.all([
    getBlogPosts(),
    getServicesContent(),
    getTestimonialsContent(),
  ]);

  return (
    <div className="p-4 sm:p-8 max-w-[1100px]">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#111111] tracking-[-0.03em]">Dashboard</h1>
        <p className="text-[14px] text-[#888] mt-1">Welcome back. Manage your website content below.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Blog posts", value: posts.length, href: "/admin/blog", color: "#EC4899" },
          { label: "Services", value: services.items.length, href: "/admin/services", color: "#F59E0B" },
          { label: "Testimonials", value: testimonials.items.length, href: "/admin/testimonials", color: "#10B981" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-[14px] border border-[#E5E7EB] p-5 hover:border-[#D0D0D0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center" style={{ background: `${s.color}12` }}>
                <span className="text-[16px] font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
              <svg className="w-4 h-4 text-[#DDD] group-hover:text-[#999] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <p className="text-[26px] font-black text-[#111111] tracking-[-0.03em]">{s.value}</p>
            <p className="text-[12.5px] text-[#888] font-medium mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-[13px] font-bold text-[#999] uppercase tracking-[0.06em] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blog/new"
            className="h-[36px] px-4 rounded-[8px] bg-[#0000B8] text-white text-[12.5px] font-semibold hover:bg-[#000096] transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New blog post
          </Link>
          <Link
            href="/admin/media"
            className="h-[36px] px-4 rounded-[8px] bg-[#F5F5F5] text-[#333] text-[12.5px] font-medium border border-[#E5E7EB] hover:bg-[#EEEEEE] hover:border-[#D0D0D0] transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            Upload media
          </Link>
          <Link
            href="/"
            target="_blank"
            className="h-[36px] px-4 rounded-[8px] bg-[#F5F5F5] text-[#333] text-[12.5px] font-medium border border-[#E5E7EB] hover:bg-[#EEEEEE] hover:border-[#D0D0D0] transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            View live site
          </Link>
        </div>
      </div>

      {/* Section cards */}
      <h2 className="text-[13px] font-bold text-[#999] uppercase tracking-[0.06em] mb-4">All Sections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map(({ label, href, desc, icon, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 hover:border-[#D0D0D0] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${color}10` }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#222] group-hover:text-[#0000B8] transition-colors truncate">{label}</p>
                <p className="text-[12px] text-[#999] mt-0.5 line-clamp-1">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
