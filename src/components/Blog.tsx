"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { posts } from "@/lib/blog";

const tagColors: Record<string, string> = {
  "Energy Saving": "bg-green-50 text-green-700",
  Technology: "bg-[#0000B8]/8 text-[#0000B8]",
  Maintenance: "bg-orange-50 text-orange-700",
  Industry: "bg-violet-50 text-violet-700",
};

export default function Blog() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.05);

  return (
    <section id="blog" ref={ref} className="py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Header ── */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 ${inView ? "animate-fade-up" : "opacity-0"}`}>
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-4">
              <span className="w-8 h-px bg-[var(--color-text-tertiary)]" />
              Resources
            </span>
            <h2 className="font-[var(--font-display)] text-[clamp(28px,3.5vw,42px)] font-bold tracking-[-0.03em] leading-[1.1]">
              HVAC insights,
              <br />
              <span className="text-[var(--color-text-tertiary)]">straight from the field.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-secondary)]
              hover:text-[var(--color-text-primary)] transition-colors duration-200 whitespace-nowrap"
          >
            View all posts
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Grid ── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${inView ? "animate-fade-up delay-1" : "opacity-0"}`}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)]
                rounded-[20px] overflow-hidden
                transition-all duration-300 ease-[var(--ease)]
                hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-[var(--color-border-hover)]"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--color-surface-raised)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${tagColors[post.tag]}`}>
                    {post.tag}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">{post.readTime}</span>
                </div>

                <h3 className="font-[var(--font-display)] text-[14.5px] font-bold text-[var(--color-text-primary)]
                  tracking-[-0.015em] leading-snug mb-2
                  transition-colors duration-200 group-hover:text-[#0000B8]">
                  {post.title}
                </h3>

                <p className="text-[12px] text-[var(--color-text-secondary)] leading-[1.7] flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">{post.date}</span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--color-text-primary)]
                    transition-all duration-200 group-hover:gap-2">
                    Read
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
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
    </section>
  );
}
