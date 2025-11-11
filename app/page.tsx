import CTASection from "@/components/cta-section";
import FAQSection from "@/components/faq-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TabsSection from "@/components/tabs-section";
import TrustedSection from "@/components/trusted-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TabsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustedSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
