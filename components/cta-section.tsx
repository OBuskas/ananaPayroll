import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-[#FCBA2E] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="flex-1">
            <h2 className="mb-4 text-balance font-bold text-3xl text-[#2A190F] md:text-4xl">
              Ready to revolutionize your payroll?
            </h2>
            <p className="mb-6 text-[#2A190F]/80 text-lg leading-relaxed">
              Join the Web3 payroll revolution. Start automating payments and
              earning yield today.
            </p>
            <Button
              asChild
              className="rounded-full bg-[#2A190F] px-8 py-6 font-bold text-lg text-white shadow-[0_4px_0_0_#DD840E] hover:bg-[#2A190F]/90"
              size="lg"
            >
              <Link href="/employer/login">Get Started Free</Link>
            </Button>
          </div>
          <div className="shrink-0">
            <Image
              alt="Piña mascot"
              className="w-48 md:w-64"
              height={250}
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              width={250}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
