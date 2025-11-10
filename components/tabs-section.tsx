"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function TabsSection() {
  const employerFeatures = [
    "Earn yield on idle payroll funds - turn waiting time into profit",
    "Automated smart contracts - no delays, no manual processing",
    "Full transparency - every transaction verified on-chain",
    "Instant payroll execution - payments deploy automatically",
    "Flexible token support - pay in stablecoins or your preferred crypto",
  ]

  const employeeFeatures = [
    "Instant payments — receive your salary automatically when the cycle ends",
    "No tracking needed — your time and earnings are already secured on-chain",
    "Shared growth — earn yield together with your employer — your money works while you do",
    "Transparent earnings history — track every payment, every yield, directly from your dashboard",
    "Funds protected by smart contracts — no middlemen, no missed paydays",
    "Access your salary anytime — request early withdrawals when you need them",
  ]

  return (
    <section className="bg-[#F2E2C4] py-20">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="employer" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/50 p-1 rounded-full mb-12 h-14">
            <TabsTrigger
              value="employer"
              className="rounded-full data-[state=active]:bg-[#FCBA2E] data-[state=active]:text-[#2A190F] data-[state=active]:shadow-md font-semibold text-base"
            >
              For Employers
            </TabsTrigger>
            <TabsTrigger
              value="employee"
              className="rounded-full data-[state=active]:bg-[#FCBA2E] data-[state=active]:text-[#2A190F] data-[state=active]:shadow-md font-semibold text-base"
            >
              For Employees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employer" className="mt-0">
            <Card className="bg-white/80 border-[#2A190F]/10 p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2A190F] mb-4">{"Don't waste your time"}</h2>
              <p className="text-lg text-[#2A190F]/80 mb-8 leading-relaxed">
                Automatize your entire payment process while your funds generate passive yield. Safely, transparently,
                and on-chain.
              </p>
              <ul className="space-y-4">
                {employerFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#F9A91C] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2A190F]/90 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="employee" className="mt-0">
            <Card className="bg-white/80 border-[#2A190F]/10 p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2A190F] mb-4">Get paid on time</h2>
              <p className="text-lg text-[#2A190F]/80 mb-8 leading-relaxed">
                Ananá Payroll gives visibility, control and ownership. See your earnings grow in real time. No delays.
                No paperwork. No worries.
              </p>
              <ul className="space-y-4">
                {employeeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#F9A91C] flex-shrink-0 mt-0.5" />
                    <span className="text-[#2A190F]/90 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
