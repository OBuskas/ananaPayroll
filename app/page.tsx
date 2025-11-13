import CTASection from "@/components/cta-section";
import FAQSection from "@/components/faq-section";
import FeaturesSection from "@/components/features-section";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TabsSection from "@/components/tabs-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TabsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      {/* <TrustedSection /> */}
      <FAQSection />
    </div>
  );
}
