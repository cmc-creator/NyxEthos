import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Modules from "@/components/Modules";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-nyx-bg">
      <Navbar />
      <Hero />
      <Modules />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
