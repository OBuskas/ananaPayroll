import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F2E2C4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-[#2A190F] sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Payroll Automation for the <span className="text-[#F9A91C]">Web3 Era</span>
            </h1>
            <p className="text-lg text-[#2A190F]/80 md:text-xl text-pretty leading-relaxed">
              Build trust between employers and employees through transparent smart contracts. Lock funds on-chain,
              automate payments, and earn yield while you wait.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-bold text-lg px-8 py-6 rounded-full shadow-[0_4px_0_0_#DD840E]"
                asChild
              >
                <Link href="/employer/login">Sign Up Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#2A190F] text-[#2A190F] hover:bg-[#2A190F] hover:text-[#F2E2C4] font-semibold text-lg px-8 py-6 rounded-full bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              alt="Piña mascot"
              width={400}
              height={400}
              className="w-full max-w-md animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
