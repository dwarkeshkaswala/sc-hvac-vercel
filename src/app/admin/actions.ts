"use server";

import { redirect } from "next/navigation";
import { adminLogin, adminLogout, requireAdmin } from "@/lib/auth";
import {
  saveContent,
  type HeroContent,
  type ServiceItem,
  type TestimonialItem,
  type TrustContent,
  type ContactContent,
} from "@/lib/content";
import { getBlogPosts } from "@/lib/content";
import type { BlogPost } from "@/lib/blog";

/* ── Auth ────────────────────────────────────────────────────── */

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok = await adminLogin(email, password);
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  await adminLogout();
  redirect("/admin/login");
}

/* ── Hero ────────────────────────────────────────────────────── */

export async function saveHeroAction(formData: FormData) {
  await requireAdmin();
  const stats: HeroContent["stats"] = [];
  let i = 0;
  while (formData.get(`stat_value_${i}`) !== null) {
    stats.push({
      value: String(formData.get(`stat_value_${i}`) ?? ""),
      label: String(formData.get(`stat_label_${i}`) ?? ""),
    });
    i++;
  }
  const content: HeroContent = {
    badge: String(formData.get("badge") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: String(formData.get("line2") ?? ""),
    line3: String(formData.get("line3") ?? ""),
    subheadline: String(formData.get("subheadline") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    stats,
  };
  await saveContent("site:hero", content);
  redirect("/admin/hero?saved=1");
}

/* ── Contact ─────────────────────────────────────────────────── */

export async function saveContactAction(formData: FormData) {
  await requireAdmin();
  const content: ContactContent = {
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    hours: String(formData.get("hours") ?? ""),
  };
  await saveContent("site:contact", content);
  redirect("/admin/contact?saved=1");
}

/* ── Services ────────────────────────────────────────────────── */

export async function saveServicesAction(data: ServiceItem[]) {
  await requireAdmin();
  await saveContent("site:services", data);
}

/* ── Testimonials ─────────────────────────────────────────────── */

export async function saveTestimonialsAction(data: TestimonialItem[]) {
  await requireAdmin();
  await saveContent("site:testimonials", data);
}

/* ── Trust ───────────────────────────────────────────────────── */

export async function saveTrustAction(data: TrustContent) {
  await requireAdmin();
  await saveContent("site:trust", data);
}

/* ── Blog ────────────────────────────────────────────────────── */

export async function saveBlogPostAction(post: BlogPost) {
  await requireAdmin();
  const posts = await getBlogPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.unshift(post); // newest first
  }
  await saveContent("blog:posts", posts);
}

export async function deleteBlogPostAction(slug: string) {
  await requireAdmin();
  const posts = await getBlogPosts();
  await saveContent("blog:posts", posts.filter((p) => p.slug !== slug));
  redirect("/admin/blog");
}
