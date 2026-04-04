import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { ContentBlock } from "@/lib/blog";
import { getBlogPosts, getBlogPost } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Shreeji HVAC Blog`,
    description: post.excerpt,
  };
}

const tagColors: Record<string, string> = {
  "Energy Saving": "bg-green-50 text-green-700",
  Technology: "bg-[#0000B8]/8 text-[#0000B8]",
  Maintenance: "bg-orange-50 text-orange-700",
  Industry: "bg-violet-50 text-violet-700",
};

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={i}
          className="font-[var(--font-display)] text-[clamp(18px,2vw,22px)] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] mt-10 mb-3"
        >
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={i}
          className="font-[var(--font-display)] text-[16px] font-bold tracking-[-0.015em] text-[var(--color-text-primary)] mt-7 mb-2"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={i}
          className="text-[15px] text-[var(--color-text-secondary)] leading-[1.85] mb-5"
        >
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="mb-5 space-y-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[14.5px] text-[var(--color-text-secondary)] leading-[1.75]">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div
          key={i}
          className="my-7 flex gap-4 bg-[#F0F7FF] border border-[#BFDBFE] rounded-[16px] p-5"
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#0000B8] flex items-center justify-center text-white mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#0000B8] mb-1">{block.label}</p>
            <p className="text-[14px] text-[#000080] leading-[1.75]">{block.text}</p>
          </div>
        </div>
      );
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="bg-[var(--color-bg)] min-h-screen pt-[104px]">

        {/* ── Hero image ── */}
        <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] overflow-hidden bg-[var(--color-surface-raised)]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6">

          {/* ── Back link ── */}
          <div className="py-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-secondary)]
                hover:text-[var(--color-text-primary)] transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All posts
            </Link>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-14 pb-20">

            {/* Left — Article ── */}
            <article>
              {/* Article header */}
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tagColors[post.tag]}`}>
                    {post.tag}
                  </span>
                  <span className="text-[12px] text-[var(--color-text-tertiary)]">{post.readTime}</span>
                  <span className="text-[12px] text-[var(--color-text-tertiary)]">·</span>
                  <span className="text-[12px] text-[var(--color-text-tertiary)]">{post.date}</span>
                </div>
                <h1 className="font-[var(--font-display)] text-[clamp(26px,3.5vw,40px)] font-bold tracking-[-0.03em] leading-[1.15] mb-6">
                  {post.title}
                </h1>
                <div className="flex items-center gap-3 pb-7 border-b border-[var(--color-border)]">
                  <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{post.author.name}</p>
                    <p className="text-[11.5px] text-[var(--color-text-tertiary)]">{post.author.role}</p>
                  </div>
                </div>
              </header>

              {/* Article body */}
              <div>
                {post.content.map((block, i) => renderBlock(block, i))}
              </div>

              {/* Footer CTA */}
              <div className="mt-12 p-8 bg-[#111111] rounded-[20px] text-white">
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/40 mb-2">Have questions?</p>
                <h3 className="font-[var(--font-display)] text-[20px] font-bold tracking-[-0.02em] mb-3">
                  Talk to an engineer, not a salesperson.
                </h3>
                <p className="text-[13.5px] text-white/50 leading-[1.75] mb-6 max-w-[440px]">
                  Every project starts with a free site assessment. We'll tell you what you actually need — even if it means a smaller scope.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-white text-[#111111] text-[13.5px] font-semibold
                      transition-all duration-300 hover:bg-white/90"
                  >
                    Get a free assessment →
                  </Link>
                  <a
                    href="https://wa.me/919054190245?text=Hi%2C%20I%20read%20your%20blog%20and%20have%20a%20question"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-[#25D366] text-white text-[13.5px] font-semibold
                      transition-all duration-300 hover:bg-[#22C55E]"
                  >
                    <svg width="16" height="16" viewBox="0 0 32 32" fill="white">
                      <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.469-2.002A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.274 19.455c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.632-.199-.898.2-.265.398-1.029 1.295-1.261 1.561-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.698.2-.232.266-.398.399-.664.133-.265.066-.497-.033-.697-.1-.199-.898-2.165-1.23-2.963-.325-.778-.655-.672-.898-.685l-.765-.013c-.266 0-.697.1-1.063.497-.365.398-1.394 1.362-1.394 3.321 0 1.96 1.427 3.854 1.626 4.12.2.265 2.807 4.286 6.803 6.01.95.41 1.692.655 2.27.839.954.304 1.822.261 2.508.158.765-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893z" />
                    </svg>
                    WhatsApp us
                  </a>
                </div>
              </div>
            </article>

            {/* Right — Sidebar ── */}
            <aside className="space-y-6">

              {/* About the author */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--color-text-tertiary)] mb-4">Written by</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{post.author.name}</p>
                    <p className="text-[12px] text-[var(--color-text-tertiary)]">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-[1.7]">
                  Part of the Shreeji HVAC team, working on commercial and industrial HVAC projects across India since 2010.
                </p>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--color-text-tertiary)] mb-4">Related posts</p>
                  <div className="space-y-4">
                    {related.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="relative w-16 h-14 rounded-[10px] overflow-hidden shrink-0 bg-[var(--color-surface-raised)]">
                          <Image
                            src={rp.image}
                            alt={rp.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-semibold text-[var(--color-text-primary)] leading-snug
                            transition-colors duration-200 group-hover:text-[#0000B8] line-clamp-2">
                            {rp.title}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">{rp.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick CTA */}
              <div className="bg-[#F5F5F5] rounded-[20px] p-6">
                <p className="font-[var(--font-display)] text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-2">
                  Need an HVAC consultation?
                </p>
                <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-[1.7] mb-4">
                  Free site assessment, no obligation. We cover all of Gujarat.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 h-[40px] px-5 rounded-full bg-[#111111] text-white text-[13px] font-semibold
                    transition-all duration-300 hover:bg-[#222222] w-full justify-center"
                >
                  Get in touch →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
