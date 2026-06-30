import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductsContent, getNavbarContent } from "@/lib/content";

export const metadata = {
  title: "Products | Shreeji HVAC & R Trading LLP",
  description: "Explore our complete range of air distribution products — Grilles, Diffusers, VAV Terminal Units, Louvers, Dampers, Sound Attenuators, HEPA Filtration, and more.",
};

export default async function ProductsPage() {
  const [products, navbar] = await Promise.all([
    getProductsContent(),
    getNavbarContent(),
  ]);

  return (
    <>
      <Navbar data={navbar} />
      <main>
        {/* Hero Banner */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#020617] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0000B8]/20 via-transparent to-[#0EA5E9]/10" />

          <div className="relative max-w-[1200px] mx-auto px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] text-white/40 mb-8">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              <span className="text-white/70">Products</span>
            </nav>

            <div className="max-w-[700px]">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0EA5E9] mb-4">
                <span className="w-8 h-px bg-[#0EA5E9]" />
                Our Product Range
              </span>
              <h1 className="font-[var(--font-display)] text-[clamp(36px,5vw,56px)] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6">
                Air Distribution <br className="hidden sm:block" />
                <span className="text-white/50">Products</span>
              </h1>
              <p className="text-[16px] sm:text-[18px] text-white/50 leading-[1.8] max-w-[560px]">
                Complete range of air distribution products — grilles, diffusers, dampers, VAV systems, louvers, nozzles, sound attenuators, HEPA filtration, and inline fans for commercial, industrial, and healthcare applications.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-8 sm:gap-14 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="text-[28px] sm:text-[36px] font-bold text-white tracking-[-0.02em]">17+</p>
                <p className="text-[12px] text-white/40 font-medium mt-1">Product Categories</p>
              </div>
              <div>
                <p className="text-[28px] sm:text-[36px] font-bold text-white tracking-[-0.02em]">5</p>
                <p className="text-[12px] text-white/40 font-medium mt-1">Patented Products</p>
              </div>
              <div>
                <p className="text-[28px] sm:text-[36px] font-bold text-white tracking-[-0.02em]">500+</p>
                <p className="text-[12px] text-white/40 font-medium mt-1">Installations</p>
              </div>
              <div>
                <p className="text-[28px] sm:text-[36px] font-bold text-white tracking-[-0.02em]">30+</p>
                <p className="text-[12px] text-white/40 font-medium mt-1">Years Industry Expertise</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Grid */}
        <section className="py-20 sm:py-28 bg-[var(--color-bg)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-12">
              <h2 className="font-[var(--font-display)] text-[clamp(24px,3vw,36px)] font-bold tracking-[-0.02em] leading-[1.2]">
                Our Products
              </h2>
              <p className="text-[14px] text-[var(--color-text-secondary)] mt-3 max-w-[500px] leading-[1.7]">
                Click on any category to learn more about specifications, features, and available configurations.
              </p>
            </div>

            {/* Main Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.items.filter(p => parseInt(p.id) <= 12).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative rounded-[20px] overflow-hidden bg-white border border-[var(--color-border)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-[220px] sm:h-[240px] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Category number badge */}
                    <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[13px] font-bold text-white">
                      {product.id}
                    </span>

                    {/* Sub-product count */}
                    {product.children && product.children.length > 0 && (
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white">
                        {product.children.length} products
                      </span>
                    )}

                    {/* Title on image */}
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-[var(--font-display)] text-[20px] sm:text-[22px] font-bold text-white tracking-[-0.01em]">
                        {product.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-4 line-clamp-2">
                      {product.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                          style={{ backgroundColor: `${product.accent}0D`, color: product.accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: product.accent }}>
                      <span>View Details</span>
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Patented Products */}
            {products.items.filter(p => parseInt(p.id) > 12).length > 0 && (
              <div className="mt-20">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <h2 className="font-[var(--font-display)] text-[clamp(20px,2.5vw,28px)] font-bold tracking-[-0.02em]">
                      Patented Products
                    </h2>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
                    EXCLUSIVE
                  </span>
                </div>
                <p className="text-[14px] text-[var(--color-text-secondary)] mb-8 max-w-[600px] leading-[1.7]">
                  Innovative patented products with unique engineering solutions — offering superior performance not available from any other manufacturer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.items.filter(p => parseInt(p.id) > 12).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group relative rounded-[20px] overflow-hidden bg-white border border-[var(--color-border)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="relative h-[220px] sm:h-[240px] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#6366F1]/90 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wide">
                          PATENTED
                        </span>
                        <div className="absolute bottom-4 left-5 right-5">
                          <h3 className="font-[var(--font-display)] text-[20px] sm:text-[22px] font-bold text-white tracking-[-0.01em]">
                            {product.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6">
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.7] mb-4 line-clamp-2">
                          {product.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                              style={{ backgroundColor: `${product.accent}0D`, color: product.accent }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: product.accent }}>
                          <span>View Details</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Brands / Trust strip */}
        <section className="py-16 bg-[var(--color-surface-raised)] border-y border-[var(--color-border)]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--color-text-tertiary)] mb-8">
              Authorized Dealer & Partner for Leading Brands
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60">
              {["COSMOS", "DAIKIN", "CARRIER", "VOLTAS", "BLUESTAR", "MITSUBISHI"].map((brand) => (
                <span key={brand} className="font-[var(--font-display)] text-[16px] sm:text-[20px] font-bold text-[var(--color-text-tertiary)] tracking-[-0.01em]">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-[#020617]">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <h2 className="font-[var(--font-display)] text-[clamp(24px,3.5vw,40px)] font-bold text-white tracking-[-0.02em] leading-[1.2] mb-5">
              Need Help Choosing the Right System?
            </h2>
            <p className="text-[15px] text-white/50 leading-[1.7] mb-10 max-w-[500px] mx-auto">
              Our engineers will assess your space, recommend the optimal solution, and handle everything from procurement to commissioning.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-[#0000B8] text-white text-[14px] font-semibold hover:bg-[#000096] transition-all shadow-[0_4px_20px_rgba(0,0,183,0.3)]"
              >
                Get a Quote
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/tools/heat-load-calculator"
                className="inline-flex items-center gap-2 h-[48px] px-7 rounded-full bg-white/10 border border-white/15 text-white text-[14px] font-semibold hover:bg-white/15 transition-all"
              >
                Heat Load Calculator
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
