import { redis } from "./redis";
import type { BlogPost } from "./blog";
import { posts as hardcodedPosts } from "./blog";

/* ── Shared types ──────────────────────────────────────────── */

export interface HeroContent {
  badge: string;
  line1: string;
  line2: string;
  line3: string;
  subheadline: string;
  phone: string;
  stats: { value: string; label: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  items: string[];
  image: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  photo: string;
  accent: string;
  rating: number;
  quote: string;
}

export interface TrustContent {
  stats: { value: string; label: string }[];
  pillars: { num: string; title: string; desc: string }[];
}

export interface ContactContent {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

/* ── Defaults ──────────────────────────────────────────────── */

export const defaultHero: HeroContent = {
  badge: "India's most trusted HVAC partner",
  line1: "Precision",
  line2: "climate",
  line3: "engineering.",
  subheadline:
    "End-to-end HVAC design, installation & maintenance for commercial towers, factories, hospitals and cold chains across Gujarat — delivered by certified engineers.",
  phone: "+91 9054190245",
  stats: [
    { value: "500+", label: "Projects Delivered" },
    { value: "15+", label: "Years in Gujarat" },
    { value: "24/7", label: "Emergency Support" },
    { value: "30%", label: "Avg. Energy Savings" },
  ],
};

export const defaultServices: ServiceItem[] = [
  {
    id: "01",
    title: "Installation & Projects",
    desc: "End-to-end HVAC system design, engineering, and installation for commercial towers, factories, hospitals, and large residential complexes.",
    items: ["VRF / VRV systems", "Central AC plants", "Chiller & AHU units", "Project management"],
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "Repair & Diagnostics",
    desc: "Rapid breakdown response with expert diagnostics covering all major HVAC brands. Our certified engineers reach you within 2 hours.",
    items: ["Emergency callout", "Compressor & PCB repair", "Gas leak detection", "Root cause analysis"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "Annual Maintenance",
    desc: "Structured AMC plans ensuring maximum equipment longevity, peak efficiency, and zero unplanned downtime across your facilities.",
    items: ["Scheduled service visits", "Filter & coil deep clean", "Performance reporting", "Priority response SLA"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "Consultancy & Audit",
    desc: "Expert technical guidance on system sizing, energy efficiency optimisation, and regulatory compliance — before you build or renovate.",
    items: ["Load calculation", "Energy audit & savings report", "Design review", "Compliance advisory"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "Ducting Systems",
    desc: "Custom GI duct fabrication, precision installation, and insulation for optimal airflow distribution across every zone.",
    items: ["GI duct fabrication", "Flexible duct routing", "Insulation wrapping", "Airflow balancing"],
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "06",
    title: "Parts & Supply",
    desc: "Genuine OEM spare parts and components for Carrier, Daikin, Voltas, Bluestar and 40+ other brands — sourced and delivered fast.",
    items: ["OEM spare parts", "Filters & coils", "Controls & sensors", "Same-day dispatch"],
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "07",
    title: "Copper Piping",
    desc: "Professional copper piping runs with silver brazing, nitrogen flushing, and full pressure testing to guarantee leak-free systems.",
    items: ["Copper pipe runs", "Silver brazing", "Nitrogen flushing", "Pressure testing"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80",
  },
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    name: "Rajesh Mehta",
    role: "Facility Manager",
    company: "Surat Diamond Bourse",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=75",
    accent: "#0000B8",
    rating: 5,
    quote:
      "Shreeji HVAC handled our 480 TR VRF installation across 4 floors seamlessly. Zero downtime since commissioning — truly professional end-to-end execution.",
  },
  {
    name: "Priya Shah",
    role: "Director of Operations",
    company: "Lotus Multispecialty Hospital",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=75",
    accent: "#16A34A",
    rating: 5,
    quote:
      "Critical environment, zero room for error. Their HEPA-integrated HVAC system meets all NABH standards and their AMC team responds within 2 hours every time.",
  },
  {
    name: "Vikram Patel",
    role: "CEO",
    company: "Patel Cold Chain Logistics",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&q=75",
    accent: "#EC4899",
    rating: 5,
    quote:
      "Six cold chambers, 18 months of flawless operation. Their cold storage expertise and energy-efficient design cut our electricity bills by 22% compared to the previous vendor.",
  },
  {
    name: "Nisha Agarwal",
    role: "Project Head",
    company: "Greenfield IT Campus",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=75",
    accent: "#8B5CF6",
    rating: 5,
    quote:
      "The chiller plant project was delivered 3 weeks ahead of schedule. Their engineering team's attention to load calculation and BMS integration was top-notch.",
  },
  {
    name: "Suresh Joshi",
    role: "Plant Manager",
    company: "Surat Textile Mill",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=75",
    accent: "#F59E0B",
    rating: 5,
    quote:
      "We've been on their AMC plan for 4 years. The team is responsive, thorough, and proactive — our production lines have never had an HVAC-related stoppage.",
  },
  {
    name: "Manav Desai",
    role: "Owner",
    company: "Adajan Luxury Residency",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=75",
    accent: "#0EA5E9",
    rating: 5,
    quote:
      "From design to handover in 6 weeks — exactly as promised. Every apartment's system is whisper-quiet. Residents absolutely love it. Would recommend without hesitation.",
  },
];

export const defaultTrust: TrustContent = {
  stats: [
    { value: "15+", label: "Years in business" },
    { value: "500+", label: "Projects delivered" },
    { value: "98%", label: "Client retention" },
    { value: "< 2h", label: "Emergency response" },
  ],
  pillars: [
    {
      num: "01",
      title: "Certified Engineers",
      desc: "Every technician holds manufacturer certifications from Daikin, Carrier, and Voltas — not just general HVAC training.",
    },
    {
      num: "02",
      title: "30% Energy Savings",
      desc: "Design-first engineering consistently delivers 25–35% reduction in power consumption vs conventional installations.",
    },
    {
      num: "03",
      title: "End-to-End Ownership",
      desc: "From site survey and system design to installation, commissioning, and long-term AMC — one team, full accountability.",
    },
    {
      num: "04",
      title: "50+ Brand Expertise",
      desc: "Carrier, Daikin, Voltas, Bluestar, Hitachi, Mitsubishi and more — install, service, and spares across all major brands.",
    },
    {
      num: "05",
      title: "24/7 Emergency Support",
      desc: "Climate failures don't wait for office hours. Our rapid-response team is on call round the clock, reaching you in under 2 hours.",
    },
    {
      num: "06",
      title: "Transparent Pricing",
      desc: "Detailed BOQ before any work begins. No hidden charges, no surprises — just clear scope and honest pricing every time.",
    },
  ],
};

export const defaultContact: ContactContent = {
  phone: "+91 9054190245",
  email: "info@shreejihvac.com",
  address: "104, Industrial Estate, Udhna\nSurat, Gujarat 394210",
  hours: "Mon – Sat: 09:00 – 19:00",
};

/* ── Generic Redis getter with fallback ─────────────────────── */

async function get<T>(key: string, fallback: T): Promise<T> {
  try {
    const data = await redis.get<T>(key);
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

/* ── Site content getters ───────────────────────────────────── */

export const getHeroContent = () => get<HeroContent>("site:hero", defaultHero);
export const getServicesContent = () => get<ServiceItem[]>("site:services", defaultServices);
export const getTestimonialsContent = () => get<TestimonialItem[]>("site:testimonials", defaultTestimonials);
export const getTrustContent = () => get<TrustContent>("site:trust", defaultTrust);
export const getContactContent = () => get<ContactContent>("site:contact", defaultContact);

/* ── Contact submissions ────────────────────────────────────── */

export const getContactSubmissions = () =>
  get<ContactSubmission[]>("contact:submissions", []);

export async function saveContactSubmission(submission: ContactSubmission) {
  const existing = await getContactSubmissions();
  existing.unshift(submission); // newest first
  // Keep only the last 200 submissions
  if (existing.length > 200) existing.length = 200;
  await redis.set("contact:submissions", existing);
}

/* ── Blog getters ───────────────────────────────────────────── */

export async function getBlogPosts(): Promise<BlogPost[]> {
  return get<BlogPost[]>("blog:posts", hardcodedPosts);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/* ── Setters (admin only — always validate with requireAdmin before calling) ── */

export async function saveContent(key: string, value: unknown) {
  await redis.set(key, value);
}
