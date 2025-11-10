import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="bg-[#FCBA2E] py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A190F] mb-4 text-balance">
              Ready to revolutionize your payroll?
            </h2>
            <p className="text-lg text-[#2A190F]/80 mb-6 leading-relaxed">
              Join the Web3 payroll revolution. Start automating payments and earning yield today.
            </p>
            <Button
              size="lg"
              className="bg-[#2A190F] hover:bg-[#2A190F]/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_4px_0_0_#DD840E]"
              asChild
            >
              <Link href="/employer/login">Get Started Free</Link>
            </Button>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              alt="Piña mascot"
              width={250}
              height={250}
              className="w-48 md:w-64"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
