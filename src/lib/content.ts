import { redis } from "./redis";
import type { BlogPost } from "./blog";
import { posts as hardcodedPosts } from "./blog";

/* ── Slug helper ───────────────────────────────────────────── */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ── Shared types ──────────────────────────────────────────── */

export interface HeroContent {
  badge: string;
  line1: string;
  line2: string;
  line3: string;
  subheadline: string;
  phone: string;
  heroImage?: string;
  stats: { value: string; label: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  items: string[];
  image: string;
}

export interface ServicesContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  description?: string;
  items: ServiceItem[];
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

export interface TestimonialsContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  items: TestimonialItem[];
}

export interface TrustContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  description?: string;
  stats: { value: string; label: string }[];
  pillars: { num: string; title: string; desc: string }[];
}

export interface ContactContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface BrandingContent {
  siteName: string;
  tagline: string;
  logo: string;
  logoDark: string;
  favicon: string;
  ogImage: string;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
}

export interface DealerItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags: string[];
  accentColor: string;
}

export interface DealersContent {
  sectionLabel?: string;
  heading: string;
  subheading: string;
  dealers: DealerItem[];
  trustIndicators: { value: string; label: string }[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  children?: { id: string; label: string; href: string }[];
}

export interface NavbarContent {
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PortfolioProject {
  title: string;
  category: string;
  scope: string;
  year: string;
  image: string;
  accent: string;
}

export interface PortfolioContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  description?: string;
  stats: { value: string; label: string }[];
  projects: PortfolioProject[];
}

export interface SubProduct {
  id: string;
  title: string;
  desc: string;
  image: string;
  model?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  image: string;
  children?: SubProduct[];
}

export interface ProductsContent {
  sectionLabel?: string;
  heading?: string;
  headingSub?: string;
  description?: string;
  items: ProductItem[];
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

export const defaultBranding: BrandingContent = {
  siteName: "Shreeji Cooling",
  tagline: "Precision climate engineering",
  logo: "",
  logoDark: "",
  favicon: "",
  ogImage: "",
  colors: {
    primary: "#0000B8",
    primaryDark: "#000096",
    accent: "#3B82F6",
    background: "#FFFFFF",
    text: "#111111",
    muted: "#666666",
  },
};

export const defaultDealers: DealersContent = {
  heading: "Authorised Dealers of",
  subheading:
    "We are proud authorised dealers of Toshiba and Carrier — delivering genuine products, certified installation, and manufacturer-backed warranty.",
  dealers: [
    {
      id: "toshiba",
      name: "Toshiba",
      logo: "/toshiba-logo.svg",
      description:
        "Authorised dealer for Toshiba HVAC systems — VRF solutions, multi-split systems, and commercial air conditioning with Japanese engineering excellence.",
      tags: ["VRF Systems", "Multi-Split", "Commercial AC"],
      accentColor: "#E31837",
    },
    {
      id: "carrier",
      name: "Carrier",
      logo: "/carrier-logo.svg",
      description:
        "Authorised dealer for Carrier — the world leader in heating, air conditioning, and refrigeration solutions for residential and commercial spaces.",
      tags: ["Ducted Systems", "Chillers", "AHU"],
      accentColor: "#0055A4",
    },
  ],
  trustIndicators: [
    { value: "100%", label: "Genuine Products" },
    { value: "Certified", label: "Installation Team" },
    { value: "Full", label: "Manufacturer Warranty" },
  ],
};

export const defaultNavbar: NavbarContent = {
  items: [
    { id: "home", label: "Home", href: "/" },
    { id: "services", label: "Services", href: "/#services" },
    { id: "products", label: "Products", href: "/products", children: [
      { id: "grilles", label: "Grilles & Registers", href: "/products/grilles-and-registers" },
      { id: "diffusers", label: "Diffusers", href: "/products/diffusers" },
      { id: "vav", label: "VAV Terminal Units", href: "/products/vav-terminal-units" },
      { id: "louvers", label: "Louvers", href: "/products/louvers" },
      { id: "dampers", label: "Life Safety Dampers", href: "/products/life-safety-dampers" },
      { id: "vcd", label: "Volume Control Dampers", href: "/products/volume-control-dampers" },
      { id: "attenuators", label: "Sound Attenuators", href: "/products/sound-attenuators" },
      { id: "ufad", label: "Under Floor Air Distribution", href: "/products/under-floor-air-distribution" },
      { id: "nozzles", label: "Nozzles", href: "/products/nozzles" },
      { id: "lab", label: "Lab Air Distribution", href: "/products/lab-air-distribution" },
      { id: "hepa", label: "Air Filtration & HEPA", href: "/products/air-filtration-and-hepa-units" },
      { id: "fans", label: "Inline Duct Fans", href: "/products/inline-duct-fans" },
    ]},
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "why-us", label: "Why Us", href: "/#why-us" },
    { id: "calculator", label: "Calculator", href: "/tools/heat-load-calculator" },
    { id: "shop", label: "Shop", href: "https://shop.shreejihvac.com", external: true },
  ],
  ctaLabel: "Get a Quote",
  ctaHref: "#contact",
};

export const defaultPortfolio: PortfolioContent = {
  stats: [
    { value: "500+", label: "Projects completed" },
    { value: "12+", label: "Years of expertise" },
    { value: "50+", label: "Brands certified" },
    { value: "98%", label: "Client retention" },
  ],
  projects: [
    { title: "Surat Diamond Bourse", category: "Commercial", scope: "VRF System — 480 TR", year: "2024", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=75", accent: "#0000B8" },
    { title: "Industrial Cold Chain Hub", category: "Industrial", scope: "Cold Storage — 6 chambers", year: "2024", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=75", accent: "#EC4899" },
    { title: "Greenfield IT Campus", category: "Corporate", scope: "Chiller Plant — 320 TR", year: "2023", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75", accent: "#8B5CF6" },
    { title: "Lotus Multispecialty Hospital", category: "Healthcare", scope: "HVAC + HEPA — 180 TR", year: "2023", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=75", accent: "#16A34A" },
    { title: "Textile Mill — Surat Unit 3", category: "Manufacturing", scope: "Ducted Systems — 260 TR", year: "2023", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=75", accent: "#F59E0B" },
    { title: "Luxury Residency — Adajan", category: "Residential", scope: "Split + VRF — 96 TR", year: "2022", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=75", accent: "#0EA5E9" },
  ],
};

export const defaultProducts: ProductsContent = {
  items: [
    { id: "01", title: "Grilles & Registers", desc: "Complete line of linear, adjustable, combination, door, egg crate, and curved duct grilles for ceiling, floor, sill, and sidewall HVAC applications.", tags: ["Linear Grilles", "Adjustable", "Combination", "Aluminum Extrusion"], accent: "#0000B8", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=75", children: [
      { id: "01-01", title: "Linear Grilles", desc: "Multi parallel fixed bar type in continuous modular sections up to 2m. Available in 0°, 15°, 30° and 45° deflection for supply and return air.", model: "CL / CLE", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-02", title: "Adjustable Grilles — Single Deflection", desc: "Single bank of adjustable blades for directional airflow control. Ideal for sidewall supply air applications.", model: "SD", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-03", title: "Adjustable Grilles — Double Deflection", desc: "Two banks of opposed adjustable blades for precise bi-directional airflow control in supply and return.", model: "DD", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-04", title: "Curve Duct Grilles — Single Deflection", desc: "Curved linear grilles for radius applications — sidewall, bulkhead, or sill mounting with single deflection.", model: "CLE-CU", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-05", title: "Curve Duct Grilles — Double Deflection", desc: "Curved duct grilles with dual opposed blade banks for architectural radius installations.", model: "CLE-CU-DD", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-06", title: "Egg Crate Grill", desc: "Square pattern open-cell grille for return air applications. High free area ratio, low pressure drop.", model: "EC", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-07", title: "Door Grill", desc: "Transfer air grilles for door mounting — ensures pressure equalization between rooms without dedicated ductwork.", model: "DG", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
      { id: "01-08", title: "Combination Grilles", desc: "Combined supply and return grille in a single frame for aesthetic uniformity in ceiling applications.", model: "CG", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "02", title: "Diffusers", desc: "Ceiling diffusers for high-standard indoor air quality — square, round, swirl, slot, perforated, laminar flow, displacement, and VAV diffusers.", tags: ["Square Face", "Swirl", "Slot", "Perforated", "Laminar Flow"], accent: "#0EA5E9", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75", children: [
      { id: "02-01", title: "Square & Rectangular Louvered Face Diffuser", desc: "Modular core directional diffuser for large volumes at low sound levels. Air pattern adjustable 1-way to 4-way.", model: "SLD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-02", title: "Perforated Diffuser", desc: "Perforated face plate diffuser providing uniform air distribution with architectural ceiling integration.", model: "PFD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-03", title: "Aluminium Round Diffuser", desc: "Circular ceiling diffuser with concentric cone pattern for 360° radial airflow distribution.", model: "ARD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-04", title: "Architectural Plaque Diffuser", desc: "Flush-mounted plaque style diffuser for premium architectural applications with minimal visual impact.", model: "APD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-05", title: "Square Swirl Diffuser", desc: "Multi-direction outlet with repositionable cores for 1-way to 4-way airflow patterns. High capacity, low noise.", model: "SSW", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-06", title: "Architectural Swirl Diffuser", desc: "Premium swirl diffuser combining architectural aesthetics with high-induction swirl air pattern.", model: "ASW", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-07", title: "Radial Vane Swirl Diffuser", desc: "Fixed radial vane design creating a powerful swirl pattern for rapid air mixing and temperature equalization.", model: "RVS", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-08", title: "High Ceiling Swirl Diffuser", desc: "Designed for mounting heights above 4m — delivers conditioned air to occupied zone in high-ceiling spaces.", model: "HCS", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-09", title: "Floor Swirl Diffuser", desc: "Underfloor air distribution swirl diffuser for raised access floor systems in modern offices.", model: "FSW", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-10", title: "Step Swirl Diffuser", desc: "Step-pattern swirl diffuser for applications requiring directional swirl with aesthetic stepped face.", model: "STS", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-11", title: "Laminar Flow Diffuser", desc: "Provides unidirectional low-turbulence airflow for clean rooms, operating theaters, and pharmaceutical facilities.", model: "LFD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-12", title: "Slot Diffuser", desc: "Linear slot-type diffuser for continuous ceiling runs — Coanda effect provides horizontal air pattern.", model: "SLT", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-13", title: "Architectural Slot Diffusers", desc: "Premium slot diffuser with architectural frame options for designer ceiling applications.", model: "ASD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-14", title: "Armstrong® Tech Zone Ceiling System", desc: "Integrated diffuser designed for Armstrong ceiling grid systems — seamless T-bar integration.", model: "ATZ", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-15", title: "High Capacity Slot Diffuser", desc: "Large-volume slot diffuser for high-airflow applications requiring maximum capacity per linear meter.", model: "HCS", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-16", title: "Linear Diffuser", desc: "Continuous linear air distribution for corridors and open-plan spaces with uniform airflow.", model: "LND", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-17", title: "Displacement Diffuser", desc: "Low-velocity displacement ventilation for superior IAQ — supplies air at floor level for natural convection.", model: "DPD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-18", title: "Disc Valve", desc: "Circular exhaust/supply valve with adjustable disc for volume control — ceiling or wall mounted.", model: "DV", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
      { id: "02-19", title: "VAV Diffuser", desc: "Integrated VAV diffuser combining air terminal and volume regulation in a single ceiling-mounted unit.", model: "VVD", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "03", title: "VAV Terminal Units", desc: "Single duct air terminals for variable and constant volume systems — engineered for reliability, precise flow regulation, and energy savings.", tags: ["Single Duct", "Fan Powered", "Bypass VAV", "Reheat Coil"], accent: "#8B5CF6", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=75", children: [
      { id: "03-01", title: "Single Duct VAV", desc: "Primary single-duct VAV terminal for zone temperature control. Dynamically calibrated for precise airflow rates.", model: "SDV", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
      { id: "03-02", title: "VAV with Electric Heater", desc: "VAV terminal with integrated electric reheat coil for zones requiring heating during low cooling load.", model: "SDV-EH", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
      { id: "03-03", title: "VAV with Hot Water Reheat Coil", desc: "VAV terminal with hydronic reheat coil for energy-efficient heating in dual-temperature systems.", model: "SDV-HW", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
      { id: "03-04", title: "Fan Powered VAV", desc: "Series or parallel fan-powered terminal for enhanced air mixing and extended heating capability.", model: "FPV", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
      { id: "03-05", title: "Bypass VAV", desc: "Bypass-type VAV terminal that diverts excess air to return plenum — maintains constant supply fan volume.", model: "BPV", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
      { id: "03-06", title: "Fresh Air VAV", desc: "Dedicated outdoor air VAV terminal for ventilation control — ensures minimum fresh air requirements per zone.", model: "FAV", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "04", title: "Louvers", desc: "Designed to protect ventilation openings from rainfall, sand, and storm while ensuring high free area and low airflow resistance.", tags: ["Fresh Air", "Weather Resistant", "Acoustic", "Sand Trap"], accent: "#16A34A", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=75", children: [
      { id: "04-01", title: "Fresh Air Louver", desc: "Standard intake louver with high free area for general ventilation applications. Aluminum blade construction.", model: "FAL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "04-02", title: "Weather Resistance Louver", desc: "Profiled blade design with built-in gutters and drainage channels to prevent rain penetration.", model: "WRL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "04-03", title: "High Performance Weather Resistance Louver", desc: "Certified rain defense louver tested by BSRIA for maximum protection in extreme climatic conditions.", model: "HPWRL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "04-04", title: "Acoustic Louver", desc: "Sound-attenuating louver combining weather protection with significant noise reduction for plant rooms.", model: "ACL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "04-05", title: "Sand Trap Louver", desc: "Multi-stage blade system designed to trap sand and dust particles in desert/arid climate installations.", model: "STL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "05", title: "Life Safety Dampers", desc: "Passive fire protection — motorized fire dampers, fusible link dampers, smoke dampers, and combination fire-smoke dampers. UL Listed & certified.", tags: ["UL Listed", "Fire Dampers", "Smoke Dampers", "Fusible Link"], accent: "#DC2626", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=75", children: [
      { id: "05-01", title: "Motorized Fire Damper — UL Listed", desc: "UL Listed motorized fire damper with 1½ hour fire resistance rating. Closes on signal from UL Listed fire sensor.", model: "FD-M-R-A", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "05-02", title: "Fusible Link Fire Damper", desc: "UL Listed thermal fusible link damper — automatic closure at 165°F without electrical power requirement.", model: "FD-FL", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "05-03", title: "Motorized Fire Damper — Non UL", desc: "Motorized fire damper for applications where UL listing is not mandated. Cost-effective fire protection.", model: "FD-M", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "05-04", title: "Smoke Damper", desc: "Motorized smoke damper for smoke compartmentation — prevents smoke migration through HVAC ductwork.", model: "SD-M", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
      { id: "05-05", title: "Combination Fire & Smoke Damper", desc: "Dual-rated combination damper providing both fire and smoke isolation in a single unit. UL 555/555S rated.", model: "FSD", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "06", title: "Volume Control Dampers", desc: "Designed to regulate airflow volume in low to high pressure HVAC systems — parallel blade, opposed blade, gravity, and round damper configurations.", tags: ["Parallel Blade", "Opposed Blade", "Low Leakage", "Motorized"], accent: "#F59E0B", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=900&q=75", children: [
      { id: "06-01", title: "VCD GV Series", desc: "Galvanized steel volume control damper with opposed/parallel blade configurations for standard HVAC duct systems.", model: "VCD-GV", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-02", title: "VCD GA Series", desc: "Aluminum extruded volume control damper — aerofoil blades for minimal pressure drop and turbulence.", model: "VCD-GA", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-03", title: "VCD GA-LL Series", desc: "Low-leakage aluminum damper with blade seals for critical applications requiring tight shut-off.", model: "VCD-GA-LL", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-04", title: "VCD AA Series", desc: "Premium aluminum aerofoil blade damper for high-pressure systems with superior flow characteristics.", model: "VCD-AA", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-05", title: "RVCD Series", desc: "Round volume control damper for circular ductwork — single blade butterfly or iris type.", model: "RVCD", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-06", title: "BDD Series", desc: "Backdraft damper preventing reverse airflow in exhaust systems — gravity-operated lightweight blades.", model: "BDD", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
      { id: "06-07", title: "PRD Series", desc: "Pressure relief damper for overpressure protection — opens automatically when set pressure is exceeded.", model: "PRD", image: "https://images.unsplash.com/photo-1596566618567-e10734dc64a0?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "07", title: "Sound Attenuators", desc: "Acoustical treatment for HVAC ductwork — reduces noise transmission with minimum pressure drop and maximum insertion loss across 63–8000Hz.", tags: ["Rectangular", "Circular", "Cross Talk", "Aerodynamic Splitter"], accent: "#EC4899", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=75", children: [
      { id: "07-01", title: "Rectangular Sound Attenuator", desc: "Splitter-type attenuator with aerodynamic profiles for optimized acoustic performance in rectangular ductwork.", model: "RSA", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=75" },
      { id: "07-02", title: "Circular Sound Attenuators", desc: "Cylindrical attenuator for round ductwork with concentric absorption lining — minimal space requirement.", model: "CSA", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=75" },
      { id: "07-03", title: "Cross Talk Sound Attenuators", desc: "Compact attenuator for transfer air paths between rooms — prevents sound transmission through shared ductwork.", model: "CTA", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "08", title: "Under Floor Air Distribution", desc: "Complete UFAD product line — floor grilles, floor swirl diffusers, and active floor tiles for raised floor systems in modern office environments.", tags: ["Floor Grilles", "Swirl Diffuser", "Active Tiles", "UFAD"], accent: "#0284C7", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75", children: [
      { id: "08-01", title: "Linear Floor Grill", desc: "Linear bar-type floor grille for raised access floors — high free area with heavy-duty load rating.", model: "LFG", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=75" },
      { id: "08-02", title: "Floor Grille", desc: "Standard raised floor grille with integrated volume control — suitable for most raised flooring systems.", model: "FG", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=75" },
      { id: "08-03", title: "Floor Swirl Diffuser", desc: "Underfloor swirl diffuser providing 360° horizontal air pattern at floor level for displacement ventilation.", model: "FSD", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=75" },
      { id: "08-04", title: "Fan Assisted Floor Grille", desc: "Active floor diffuser with integrated fan for enhanced airflow — overcomes static pressure limitations in UFAD.", model: "FAG", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "09", title: "Nozzles", desc: "Specialist units for large areas requiring targeted long-throw air distribution — ideal for malls, auditoriums, airports, and arenas.", tags: ["Jet Nozzles", "Spot Nozzle", "Drum Louver", "Long Throw"], accent: "#7C3AED", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=75", children: [
      { id: "09-01", title: "Jet Nozzles", desc: "Long-throw supply nozzle for large spaces — 360° rotation and ±30° tilt adjustment. Aluminum construction, low noise.", model: "JNZ", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=75" },
      { id: "09-02", title: "Spot Nozzle", desc: "Focused directional nozzle for spot cooling/heating — ideal for high-ceiling industrial and retail applications.", model: "SNZ", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=75" },
      { id: "09-03", title: "Drum Louver", desc: "Cylindrical directional outlet with adjustable drum for variable air pattern — sidewall or exposed duct mounting.", model: "DLR", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=75" },
      { id: "09-04", title: "Jet Flow Diffuser", desc: "High-induction jet diffuser combining long throw with rapid entrainment for uniform space conditioning.", model: "JFD", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "10", title: "Lab Air Distribution", desc: "Application-oriented solutions for laboratories — VAV dampers, CAV terminals, airflow measuring stations, and constant air volume regulators.", tags: ["VAV Damper", "CAV Terminal", "Flow Measuring", "Precision"], accent: "#059669", image: "https://images.unsplash.com/photo-1582719471384-894fbb16564e?auto=format&fit=crop&w=900&q=75", children: [
      { id: "10-01", title: "VAV Damper", desc: "Variable air volume damper for laboratory fume hood exhaust control — precise measurement with low signal-to-noise ratio.", model: "LAB-VAV", image: "https://images.unsplash.com/photo-1582719471384-894fbb16564e?auto=format&fit=crop&w=600&q=75" },
      { id: "10-02", title: "CAV Terminal", desc: "Constant air volume terminal maintaining fixed airflow regardless of system pressure variations.", model: "LAB-CAV", image: "https://images.unsplash.com/photo-1582719471384-894fbb16564e?auto=format&fit=crop&w=600&q=75" },
      { id: "10-03", title: "Air Flow Measuring Station", desc: "Precision airflow measurement device with aluminum flow sensor and honeycomb straightener for lab environments.", model: "AFMS", image: "https://images.unsplash.com/photo-1582719471384-894fbb16564e?auto=format&fit=crop&w=600&q=75" },
      { id: "10-04", title: "Constant Air Volume Regulator", desc: "Mechanical self-regulating device maintaining constant volume without external power — spring-loaded operation.", model: "CAVR", image: "https://images.unsplash.com/photo-1582719471384-894fbb16564e?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "11", title: "Air Filtration & HEPA Units", desc: "Highest level filtration for commercial and industrial applications — pre-filters, fine filters, HEPA filters, and mini-pleat HEPA terminal units.", tags: ["HEPA Filter", "Pre Filter", "Fine Filter", "EN1822 Tested"], accent: "#0891B2", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=75", children: [
      { id: "11-01", title: "Pre Filter", desc: "Primary filtration stage capturing large particles (G3/G4 grade) — protects downstream fine and HEPA filters.", model: "PF", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=75" },
      { id: "11-02", title: "Fine Filter", desc: "Secondary filtration (F7–F9 grade) for removing fine particulates — bag or compact rigid type configurations.", model: "FF", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=75" },
      { id: "11-03", title: "HEPA Filter", desc: "High Efficiency Particulate Air filter (H13/H14) for clean rooms, hospitals, and pharma — EN1822 tested.", model: "HEPA", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=75" },
      { id: "11-04", title: "Mini Pleat HEPA Filter", desc: "Compact mini-pleat construction maximizing filter area in minimal depth — ideal for terminal HEPA units.", model: "MP-HEPA", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "12", title: "Inline Duct Fans", desc: "Compact centrifugal exhaust and supply inline fans for limited-space installations — silent operation with backward curved high-efficiency impellers.", tags: ["Rectangular Fan", "Filtered Exhaust", "External Rotor", "IAQ"], accent: "#475569", image: "https://images.unsplash.com/photo-1567071256-db99fc12c3a0?auto=format&fit=crop&w=900&q=75", children: [
      { id: "12-01", title: "Rectangular Duct Fan", desc: "Centrifugal inline fan with backward curved impeller — direct installation into rectangular duct systems at any angle.", model: "CRD", image: "https://images.unsplash.com/photo-1567071256-db99fc12c3a0?auto=format&fit=crop&w=600&q=75" },
      { id: "12-02", title: "Filtered Exhaust Fan Module", desc: "Fan module with integrated filtration for clean room exhaust — removes micro-contaminants, ideal for hazardous materials.", model: "FEM", image: "https://images.unsplash.com/photo-1567071256-db99fc12c3a0?auto=format&fit=crop&w=600&q=75" },
    ]},
    { id: "13", title: "Oval VAV", desc: "Patented oval-shaped Variable Air Volume terminal for unique duct configurations — optimized aerodynamics and space efficiency.", tags: ["Patented", "Oval Shape", "Space Efficient", "Low Pressure Drop"], accent: "#6366F1", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=900&q=75" },
    { id: "14", title: "Floor Grille", desc: "Patented floor grille design with integrated features for aesthetic continuity — suitable for most raised flooring systems with easy drop-in installation.", tags: ["Patented", "Drop-in", "Raised Floor", "Aesthetic"], accent: "#B45309", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75" },
    { id: "15", title: "Clairis IAQ Diffuser", desc: "Patented Indoor Air Quality diffuser with advanced air purification integration — designed for spaces demanding superior air quality standards.", tags: ["Patented", "IAQ", "Air Purification", "Smart Diffuser"], accent: "#10B981", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75" },
    { id: "16", title: "Dynamic Diffuser", desc: "Patented dynamic diffuser with adjustable air pattern technology — adapts airflow direction and volume based on real-time zone requirements.", tags: ["Patented", "Dynamic", "Adjustable Pattern", "Smart Control"], accent: "#F43F5E", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=75" },
    { id: "17", title: "VAV System Controller", desc: "Patented intelligent VAV system controller — seamless BMS integration with precise airflow regulation and energy optimization algorithms.", tags: ["Patented", "BMS Integration", "Energy Optimization", "Digital Control"], accent: "#1D4ED8", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=75" },
  ],
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
export async function getServicesContent(): Promise<ServicesContent> {
  const raw = await redis.get<ServicesContent | ServiceItem[]>("site:services").catch(() => null);
  if (!raw) return { items: defaultServices };
  if (Array.isArray(raw)) return { items: raw };
  return raw;
}
export async function getTestimonialsContent(): Promise<TestimonialsContent> {
  const raw = await redis.get<TestimonialsContent | TestimonialItem[]>("site:testimonials").catch(() => null);
  if (!raw) return { items: defaultTestimonials };
  if (Array.isArray(raw)) return { items: raw };
  return raw;
}
export const getTrustContent = () => get<TrustContent>("site:trust", defaultTrust);
export const getContactContent = () => get<ContactContent>("site:contact", defaultContact);
export const getBrandingContent = () => get<BrandingContent>("site:branding", defaultBranding);
export const getDealersContent = () => get<DealersContent>("site:dealers", defaultDealers);

export async function getNavbarContent(): Promise<NavbarContent> {
  const stored = await redis.get<NavbarContent>("site:navbar").catch(() => null);
  if (!stored) return defaultNavbar;
  // Merge children from defaults if stored navbar items are missing them
  const items = stored.items.map((item) => {
    const def = defaultNavbar.items.find((d) => d.id === item.id);
    if (def?.children && !item.children) {
      return { ...item, children: def.children };
    }
    return item;
  });
  return { ...stored, items };
}
export const getPortfolioContent = () => get<PortfolioContent>("site:portfolio", defaultPortfolio);

export async function getProductsContent(): Promise<ProductsContent> {
  const stored = await redis.get<ProductsContent>("site:products").catch(() => null);
  if (!stored) return defaultProducts;
  // Merge children from defaults if stored products are missing them
  const items = stored.items.map((item) => {
    const def = defaultProducts.items.find((d) => d.id === item.id);
    if (def?.children && !item.children) {
      return { ...item, children: def.children };
    }
    return item;
  });
  return { ...stored, items };
}

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

export async function getContent(key: string): Promise<unknown> {
  return redis.get(key);
}

export async function saveContent(key: string, value: unknown) {
  await redis.set(key, value);
}
