import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductsContent, getNavbarContent, slugify } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const products = await getProductsContent();
  const product = products.items.find(
    (p) => slugify(p.title) === slug
  );
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Shreeji HVAC Products`,
    description: product.desc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [products, navbar] = await Promise.all([
    getProductsContent(),
    getNavbarContent(),
  ]);

  const product = products.items.find(
    (p) => slugify(p.title) === slug
  );

  if (!product) notFound();

  // Get related products (all others)
  const related = products.items.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Navbar data={navbar} />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-[#020617] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#020617]" />
          </div>

          <div className="relative max-w-[1200px] mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-8">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              <Link href="/products" className="hover:text-white/70 transition-colors">Products</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              <span className="text-white/70">{product.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.accent }} />
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">
                    {parseInt(product.id) > 12 ? "Patented Product" : `Product Category ${product.id}`}
                  </span>
                </div>
                <h1 className="font-[var(--font-display)] text-[clamp(32px,4.5vw,52px)] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6">
                  {product.title}
                </h1>
                <p className="text-[16px] sm:text-[18px] text-white/50 leading-[1.8] max-w-[500px] mb-8">
                  {product.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-white/10 bg-white/5 text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                    style={{ backgroundColor: product.accent }}
                  >
                    Request Quote
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                  <a
                    href={`https://wa.me/919054190245?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-white/10 border border-white/15 text-white text-[13px] font-semibold hover:bg-white/15 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.29-1.24l-.3-.18-3.13.82.84-3.04-.2-.3A8 8 0 1112 20z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Product image card */}
              <div className="relative hidden lg:block">
                <div className="relative h-[400px] rounded-[24px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.3)] border border-white/10">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Products Grid */}
        {product.children && product.children.length > 0 && (
          <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="mb-12">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] mb-3">
                  <span className="w-8 h-px" style={{ backgroundColor: product.accent }} />
                  Product Range
                </span>
                <h2 className="font-[var(--font-display)] text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.02em] leading-[1.2]">
                  {product.title} — All Models
                </h2>
                <p className="text-[14px] text-[var(--color-text-secondary)] mt-3 max-w-[600px] leading-[1.7]">
                  {product.children.length} products available in this category. Contact us for specifications, pricing, and availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {product.children.map((child) => (
                  <div
                    key={child.id}
                    className="group relative rounded-[16px] overflow-hidden bg-white border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-400 hover:-translate-y-0.5"
                  >
                    {/* Image */}
                    <div className="relative h-[160px] overflow-hidden bg-[var(--color-surface-raised)]">
                      <Image
                        src={child.image}
                        alt={child.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {child.model && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[9px] font-bold text-white/80 tracking-wide">
                          {child.model}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-[14px] font-bold text-[var(--color-text-primary)] leading-snug mb-2 line-clamp-2">
                        {child.title}
                      </h3>
                      <p className="text-[12px] text-[var(--color-text-secondary)] leading-[1.6] line-clamp-3">
                        {child.desc}
                      </p>
                    </div>

                    {/* Hover CTA overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-8 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={`https://wa.me/919054190245?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(child.title)}%20(${encodeURIComponent(child.model || '')})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-[36px] rounded-full text-[11px] font-semibold text-white transition-all"
                        style={{ backgroundColor: product.accent }}
                      >
                        Enquire Now
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features (show when no children or alongside children) */}
        <section className="py-20 sm:py-28 bg-[var(--color-bg)]" style={{ display: product.children && product.children.length > 0 ? 'none' : undefined }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-[16px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: `${product.accent}15` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={product.accent} strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
                <h3 className="text-[15px] font-bold mb-2">High Performance</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                  Engineered for maximum efficiency and reliability in demanding commercial environments.
                </p>
              </div>
              <div className="p-6 rounded-[16px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: `${product.accent}15` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={product.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h3 className="text-[15px] font-bold mb-2">Warranty Backed</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                  All products come with manufacturer warranty and our extended service guarantee.
                </p>
              </div>
              <div className="p-6 rounded-[16px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4" style={{ backgroundColor: `${product.accent}15` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={product.accent} strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
                </div>
                <h3 className="text-[15px] font-bold mb-2">Expert Installation</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7]">
                  Certified engineers handle design, installation, commissioning, and AMC — turnkey delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20 bg-[var(--color-surface-raised)] border-t border-[var(--color-border)]">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-[var(--font-display)] text-[clamp(20px,2.5vw,28px)] font-bold tracking-[-0.02em]">
                  Other Products
                </h2>
                <Link href="/products" className="text-[12px] font-semibold text-[#0000B8] hover:underline">
                  View All →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${slugify(p.title)}`}
                    className="group relative rounded-[16px] overflow-hidden bg-white border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative h-[180px] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <h3 className="absolute bottom-3 left-4 text-[16px] font-bold text-white">{p.title}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-[12px] text-[var(--color-text-secondary)] line-clamp-2 leading-[1.6]">{p.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-[#020617]">
          <div className="max-w-[600px] mx-auto px-6 text-center">
            <h2 className="font-[var(--font-display)] text-[clamp(20px,3vw,32px)] font-bold text-white tracking-[-0.02em] mb-4">
              Interested in {product.title}?
            </h2>
            <p className="text-[14px] text-white/50 mb-8">
              Get a custom quote tailored to your project requirements.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 h-[46px] px-7 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: product.accent }}
            >
              Contact Our Team
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
