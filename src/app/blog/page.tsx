import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog — Shreeji HVAC",
  description:
    "HVAC insights, maintenance tips, and industry knowledge from the Shreeji team.",
};

const tagColors: Record<string, string> = {
  "Energy Saving": "bg-green-50 text-green-700",
  Technology: "bg-blue-50 text-blue-700",
  Maintenance: "bg-orange-50 text-orange-700",
  Industry: "bg-violet-50 text-violet-700",
};

export default async function BlogListPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="bg-[var(--color-bg)] min-h-screen pt-[104px]">

        {/* ── Page Header ── */}
        <div className="max-w-[1200px] mx-auto px-6 py-16 border-b border-[var(--color-border)]">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
            <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
            Resources
          </span>
          <h1 className="font-[var(--font-display)] text-[clamp(32px,4vw,56px)] font-bold tracking-[-0.03em] leading-[1.08] mb-4">
            HVAC insights,
            <br />
            <span className="text-[var(--color-text-tertiary)]">straight from the field.</span>
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] leading-[1.75]">
            Practical guides, technical breakdowns, and honest advice from engineers who spend their days in plant rooms and on rooftops.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-14">

          {/* ── Featured Post ── */}
          <Link href={`/blog/${featured.slug}`} className="group block mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] overflow-hidden
              transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.09)] hover:border-[var(--color-border-hover)]">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden min-h-[280px]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Content */}
              <div className="flex flex-col justify-center p-10 lg:p-14">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tagColors[featured.tag]}`}>
                    {featured.tag}
                  </span>
                  <span className="text-[12px] text-[var(--color-text-tertiary)]">{featured.readTime}</span>
                </div>
                <h2 className="font-[var(--font-display)] text-[clamp(22px,2.4vw,32px)] font-bold tracking-[-0.025em] leading-[1.2] mb-4
                  transition-colors duration-200 group-hover:text-[#2563EB]">
                  {featured.title}
                </h2>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-[1.8] mb-6">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{featured.author.name}</p>
                    <p className="text-[11.5px] text-[var(--color-text-tertiary)]">{featured.author.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-text-primary)]
                    transition-all duration-200 group-hover:gap-2.5">
                    Read article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--color-text-tertiary)] mt-5">{featured.date}</p>
              </div>
            </div>
          </Link>

          {/* ── Rest of posts ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[20px] overflow-hidden
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-[var(--color-border-hover)]">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-surface-raised)]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tagColors[post.tag]}`}>
                      {post.tag}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">{post.readTime}</span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-[15.5px] font-bold text-[var(--color-text-primary)]
                    tracking-[-0.015em] leading-snug mb-2 flex-1
                    transition-colors duration-200 group-hover:text-[#2563EB]">
                    {post.title}
                  </h3>
                  <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-[1.7] mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">{post.author.name}</p>
                      <p className="text-[11px] text-[var(--color-text-tertiary)]">{post.date}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--color-text-secondary)]
                      transition-all duration-200 group-hover:text-[var(--color-text-primary)] group-hover:gap-2">
                      Read
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
