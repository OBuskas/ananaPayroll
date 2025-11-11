import { Eye, Globe, Lock, Shield, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description:
        "Smart contracts ensure your funds are protected and transparent",
    },
    {
      icon: TrendingUp,
      title: "Earn Yield",
      description:
        "Generate passive income on idle payroll funds automatically",
    },
    {
      icon: Zap,
      title: "Instant Automation",
      description: "Payments execute automatically at the end of each cycle",
    },
    {
      icon: Lock,
      title: "Trustless System",
      description:
        "No middlemen, no delays - just pure smart contract execution",
    },
    {
      icon: Globe,
      title: "Global Payments",
      description: "Pay anyone, anywhere with crypto - no borders, no banks",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description:
        "Every transaction visible on-chain for complete accountability",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl text-[#2A190F] md:text-4xl">
            Why Choose Ananá Payroll?
          </h2>
          <p className="mx-auto max-w-2xl text-[#2A190F]/70 text-lg">
            The future of payroll is here. Transparent, automated, and built on
            Web3.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                className="rounded-2xl border-[#2A190F]/10 bg-[#F2E2C4] p-6 transition-shadow hover:shadow-lg"
                key={feature.title}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#FCBA2E] p-3">
                    <Icon className="h-6 w-6 text-[#2A190F]" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-[#2A190F] text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-[#2A190F]/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
