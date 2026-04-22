import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SmartScanner } from "@/components/SmartScanner";
import { Features } from "@/components/Features";
import { MapSection } from "@/components/MapSection";
import { SosSection } from "@/components/SosSection";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SmartScanner />
        <Features />
        <MapSection />
        <SosSection />
        <Pricing />
      </main>
      <Footer />
      <AiAssistant />
    </div>
  );
};

export default Index;
