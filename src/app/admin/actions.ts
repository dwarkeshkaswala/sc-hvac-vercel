"use server";

import { redirect } from "next/navigation";
import { adminLogin, adminLogout, requireAdmin, changeAdminPassword } from "@/lib/auth";
import {
  saveContent,
  type HeroContent,
  type ServiceItem,
  type TestimonialItem,
  type TrustContent,
  type ContactContent,
  type ContactSubmission,
  type BrandingContent,
  type DealersContent,
  type NavbarContent,
  saveContactSubmission,
  getContactSubmissions,
} from "@/lib/content";
import { redis } from "@/lib/redis";
import { getBlogPosts } from "@/lib/content";
import type { BlogPost } from "@/lib/blog";
import { sendContactEmail } from "@/lib/email";

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

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (newPassword.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters." };
  }
  return changeAdminPassword(currentPassword, newPassword);
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

/* ── Hero (typed — used by HeroEditor client component) ───────── */

export async function saveHeroDataAction(content: HeroContent) {
  await requireAdmin();
  await saveContent("site:hero", content);
}

/* ── Contact (typed — used by ContactEditor client component) ─── */

export async function saveContactDataAction(content: ContactContent) {
  await requireAdmin();
  await saveContent("site:contact", content);
}

/* ── Services ────────────────────────────────────────────────── */

export async function saveServicesAction(data: ServiceItem[]) {
  await requireAdmin();
  // Wrap in ServicesContent to preserve existing header fields
  const existing = await redis.get<Record<string, unknown>>("site:services").catch(() => null);
  const wrapper = (existing && !Array.isArray(existing)) ? { ...existing, items: data } : { items: data };
  await saveContent("site:services", wrapper);
}

/* ── Testimonials ─────────────────────────────────────────────── */

export async function saveTestimonialsAction(data: TestimonialItem[]) {
  await requireAdmin();
  // Wrap in TestimonialsContent to preserve existing header fields
  const existing = await redis.get<Record<string, unknown>>("site:testimonials").catch(() => null);
  const wrapper = (existing && !Array.isArray(existing)) ? { ...existing, items: data } : { items: data };
  await saveContent("site:testimonials", wrapper);
}

/* ── Trust ───────────────────────────────────────────────────── */

export async function saveTrustAction(data: TrustContent) {
  await requireAdmin();
  await saveContent("site:trust", data);
}

/* ── Branding ────────────────────────────────────────────────── */

export async function saveBrandingAction(data: BrandingContent) {
  await requireAdmin();
  await saveContent("site:branding", data);
}

/* ── Dealers ─────────────────────────────────────────────────── */

export async function saveDealersAction(data: DealersContent) {
  await requireAdmin();
  await saveContent("site:dealers", data);
}

/* ── Navbar ──────────────────────────────────────────────────── */

export async function saveNavbarAction(data: NavbarContent) {
  await requireAdmin();
  await saveContent("site:navbar", data);
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

/* ── Contact-form submissions (public) ────────────────────── */

export async function submitContactFormAction(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  // Basic server-side validation
  if (!data.name.trim() || !data.email.trim() || !data.service.trim() || !data.message.trim()) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    service: data.service.trim(),
    message: data.message.trim(),
    createdAt: new Date().toISOString(),
  };

  // Save to Redis
  await saveContactSubmission(submission);

  // Send email (non-blocking — don't fail the form if email fails)
  try {
    await sendContactEmail(submission);
  } catch (err) {
    console.error("[contact-email] Failed to send:", err);
  }

  return { ok: true };
}

/* ── Contact submissions admin ────────────────────────────── */

export async function deleteContactSubmissionAction(id: string) {
  await requireAdmin();
  const submissions = await getContactSubmissions();
  await saveContent(
    "contact:submissions",
    submissions.filter((s) => s.id !== id)
  );
}

/* ── Reset keys to defaults (forces new content to take effect) ── */

export async function resetNavbarToDefaultAction() {
  await requireAdmin();
  await redis.del("site:navbar");
}

export async function resetProductsToDefaultAction() {
  await requireAdmin();
  await redis.del("site:products");
}

export async function resetNavbarAndProductsAction() {
  await requireAdmin();
  await redis.del("site:navbar");
  await redis.del("site:products");
}
