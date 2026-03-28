import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Trust from "@/components/Trust";
import Brands from "@/components/Brands";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Products />
        <Portfolio />
        <Testimonials />
        <Blog />
        <Trust />
        <Brands />
        <Contact />
      </main>
      <Footer />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919054190245?text=Hi%2C%20I%27m%20interested%20in%20Shreeji%20HVAC%20services"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-[#25D366]
                   flex items-center justify-center
                   shadow-[0_4px_20px_rgba(37,211,102,0.5)]
                   hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.65)]
                   transition-all duration-300"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="white">
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.469-2.002A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.486-.289-4.99 1.18 1.243-4.836-.317-.497A13.26 13.26 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.274-9.878c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.632-.199-.898.2-.265.398-1.029 1.295-1.261 1.561-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.698.2-.232.266-.398.399-.664.133-.265.066-.497-.033-.697-.1-.199-.898-2.165-1.23-2.963-.325-.778-.655-.672-.898-.685l-.765-.013c-.266 0-.697.1-1.063.497-.365.398-1.394 1.362-1.394 3.321 0 1.96 1.427 3.854 1.626 4.12.2.265 2.807 4.286 6.803 6.01.95.41 1.692.655 2.27.839.954.304 1.822.261 2.508.158.765-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893-.1-.166-.365-.265-.763-.464z"/>
        </svg>
      </a>
    </>
  );
}
