import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TabsSection from "@/components/tabs-section"
import FeaturesSection from "@/components/features-section"
import HowItWorksSection from "@/components/how-it-works-section"
import TrustedSection from "@/components/trusted-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

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
  )
}
