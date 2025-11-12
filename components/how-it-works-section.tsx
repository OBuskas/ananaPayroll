import { Card } from "@/components/ui/card";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create Your Payroll",
      description:
        "Set up employee contracts, salary amounts, and payment schedules in minutes",
    },
    {
      number: "02",
      title: "Lock Funds On-Chain",
      description:
        "Deposit funds into transparent smart contracts visible to all parties",
    },
    {
      number: "03",
      title: "Earn While You Wait",
      description:
        "Locked funds generate yield automatically through DeFi protocols",
    },
    {
      number: "04",
      title: "Auto-Execute Payments",
      description:
        "Smart contracts release payments automatically at cycle end",
    },
  ];

  return (
    <section className="bg-[#F2E2C4] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-4 text-center">
          <h2 className="mb-4 font-bold text-3xl text-[#2A190F] md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-[#2A190F]/70 text-lg">
            Simple, transparent, and fully automated payroll in four steps
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {steps.map((step) => (
            <Card
              className="relative overflow-hidden rounded-2xl border-[#2A190F]/10 bg-white p-6"
              key={step.number}
            >
              <div className="-mr-4 -mt-2 absolute top-0 right-0 font-bold text-8xl text-[#FCBA2E]/10">
                {step.number}
              </div>
              <div className="relative">
                <div className="mb-2 font-bold text-3xl text-[#F9A91C]">
                  {step.number}
                </div>
                <h3 className="mb-2 font-bold text-[#2A190F] text-xl">
                  {step.title}
                </h3>
                <p className="text-[#2A190F]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
