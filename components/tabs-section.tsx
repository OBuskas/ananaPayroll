"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsSection() {
  const employerFeatures = [
    "Automated smart contracts: no delays, no manual processing",
    "Full transparency: every transaction verified on-chain",
    "Instant payroll execution: payments deploy automatically",
    "Flexible token support: pay in stablecoins or your preferred crypto",
  ];

  const employeeFeatures = [
    "Instant payments: receive your salary automatically when the cycle ends",
    "No tracking needed: your time and earnings are already secured on-chain",
    "Shared growth: earn yield together with your employer, your money works while you do",
    "Transparent earnings history: track every payment, every yield, directly from your dashboard",
    "Funds protected by smart contracts: no middlemen, no missed paydays",
    "Access your salary anytime: request early withdrawals when you need them",
  ];

  return (
    <section className="bg-[#F2E2C4] pt-2 pb-6 md:py-12">
      <div className="container mx-auto">
        <Tabs className="w-full" defaultValue="employer">
          <TabsList className="mx-auto grid h-14 w-full max-w-md grid-cols-2 rounded-full bg-white/50 p-1 pb-1">
            <TabsTrigger
              className="rounded-full font-semibold text-base data-[state=active]:bg-[#FCBA2E] data-[state=active]:text-[#2A190F] data-[state=active]:shadow-md"
              value="employer"
            >
              For Employers
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full font-semibold text-base data-[state=active]:bg-[#FCBA2E] data-[state=active]:text-[#2A190F] data-[state=active]:shadow-md"
              value="employee"
            >
              For Employees
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-0" value="employer">
            <Card className="rounded-3xl border-[#2A190F]/10 bg-white/80 p-8 md:p-12">
              <h2 className="mb-2 font-bold text-3xl text-[#2A190F] md:text-4xl">
                {"Don't waste your time"}
              </h2>
              <p className="mb-4 text-[#2A190F]/80 text-lg leading-relaxed">
                Automatize your entire payment process while your funds generate
                passive yield. Safely, transparently, and on-chain.
              </p>
              <ul className="space-y-4">
                {employerFeatures.map((feature) => (
                  <li className="flex items-start gap-3" key={feature}>
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#F9A91C]" />
                    <span className="text-[#2A190F]/90 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent className="mt-0" value="employee">
            <Card className="rounded-3xl border-[#2A190F]/10 bg-white/80 p-8 md:p-12">
              <h2 className="mb-2 font-bold text-3xl text-[#2A190F] md:text-4xl">
                Get paid on time
              </h2>
              <p className="mb-4 text-[#2A190F]/80 text-lg leading-relaxed">
                Ananá Payroll gives visibility, control and ownership. See your
                earnings grow in real time. No delays. No paperwork. No worries.
              </p>
              <ul className="space-y-4">
                {employeeFeatures.map((feature) => (
                  <li className="flex items-start gap-3" key={feature}>
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#F9A91C]" />
                    <span className="text-[#2A190F]/90 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
