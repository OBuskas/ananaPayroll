import CTASection from "@/components/cta-section";
import FAQSection from "@/components/faq-section";
import FeaturesSection from "@/components/features-section";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TabsSection from "@/components/tabs-section";
import TrustedSection from "@/components/trusted-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TabsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustedSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
