import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Products from "@/components/Products";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
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
        <Trust />
        <Brands />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
