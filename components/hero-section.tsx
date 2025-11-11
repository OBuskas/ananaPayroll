import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F2E2C4] py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-balance font-bold text-4xl text-[#2A190F] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Payroll Automation for the{" "}
              <span className="text-[#F9A91C]">Web3 Era</span>
            </h1>
            <p className="text-pretty text-[#2A190F]/80 text-lg leading-relaxed md:text-xl">
              Build trust between employers and employees through transparent
              smart contracts. Lock funds on-chain, automate payments, and earn
              yield while you wait.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="rounded-full bg-[#FCBA2E] px-8 py-6 font-bold text-[#2A190F] text-lg shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                size="lg"
              >
                <Link href="/employer/login">Sign Up Free</Link>
              </Button>
              <Button
                className="rounded-full border-2 border-[#2A190F] bg-transparent px-8 py-6 font-semibold text-[#2A190F] text-lg hover:bg-[#2A190F] hover:text-[#F2E2C4]"
                size="lg"
                variant="outline"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              alt="Piña mascot"
              className="w-full max-w-md animate-float"
              height={400}
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              width={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
