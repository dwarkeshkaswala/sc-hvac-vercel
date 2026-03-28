import Link from "next/link";
import { getBlogPosts, getServicesContent, getTestimonialsContent } from "@/lib/content";

const sections = [
  { label: "Hero Section", href: "/admin/hero", desc: "Headline, stats, phone number" },
  { label: "Services", href: "/admin/services", desc: "Add, edit, or remove services" },
  { label: "Testimonials", href: "/admin/testimonials", desc: "Client quotes and photos" },
  { label: "Trust / Why Us", href: "/admin/trust", desc: "Stats and pillar cards" },
  { label: "Contact Info", href: "/admin/contact", desc: "Phone, email, address, hours" },
  { label: "Blog Posts", href: "/admin/blog", desc: "Create, edit, delete articles" },
];

export default async function AdminDashboard() {
  const [posts, services, testimonials] = await Promise.all([
    getBlogPosts(),
    getServicesContent(),
    getTestimonialsContent(),
  ]);

  return (
    <div className="p-4 sm:p-8 max-w-[900px]">
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#111111] tracking-[-0.02em]">Dashboard</h1>
        <p className="text-[14px] text-[#666] mt-1">Manage your website content from here.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Blog posts", value: posts.length },
          { label: "Services", value: services.length },
          { label: "Testimonials", value: testimonials.length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
            <p className="text-[28px] font-black text-[#111111] tracking-[-0.03em]">{s.value}</p>
            <p className="text-[12.5px] text-[#666] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ label, href, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 hover:border-[#2563EB] hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-200 group"
          >
            <p className="text-[15px] font-bold text-[#111111] group-hover:text-[#2563EB] transition-colors">{label}</p>
            <p className="text-[12.5px] text-[#666] mt-1">{desc}</p>
            <p className="text-[12px] text-[#2563EB] font-semibold mt-3">Edit →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
