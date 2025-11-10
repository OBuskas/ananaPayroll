import { Card } from "@/components/ui/card"

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create Your Payroll",
      description: "Set up employee contracts, salary amounts, and payment schedules in minutes",
    },
    {
      number: "02",
      title: "Lock Funds On-Chain",
      description: "Deposit funds into transparent smart contracts visible to all parties",
    },
    {
      number: "03",
      title: "Earn While You Wait",
      description: "Locked funds generate yield automatically through DeFi protocols",
    },
    {
      number: "04",
      title: "Auto-Execute Payments",
      description: "Smart contracts release payments automatically at cycle end",
    },
  ]

  return (
    <section className="bg-[#F2E2C4] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A190F] mb-4">How It Works</h2>
          <p className="text-lg text-[#2A190F]/70 max-w-2xl mx-auto">
            Simple, transparent, and fully automated payroll in four steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="bg-white border-[#2A190F]/10 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl font-bold text-[#FCBA2E]/10 -mr-4 -mt-4">
                {step.number}
              </div>
              <div className="relative">
                <div className="text-3xl font-bold text-[#F9A91C] mb-3">{step.number}</div>
                <h3 className="text-xl font-bold text-[#2A190F] mb-3">{step.title}</h3>
                <p className="text-[#2A190F]/70 leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
