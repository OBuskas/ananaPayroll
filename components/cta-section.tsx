import Image from "next/image";

export default function CTASection() {
  return (
    <section className="bg-[#FCBA2E] pt-6">
      <div className="container mx-auto px-4">
        <div className="flex max-w-5xl flex-1 flex-col items-center justify-between gap-8 px-auto lg:flex-row">
          <div className="flex-1">
            <h2 className="text-balance pb-4 font-bold text-3xl text-[#2A190F] md:text-4xl">
              Ready to revolutionize your payroll?
            </h2>
            <p className="mb-6 text-[#2A190F]/80 text-lg leading-relaxed">
              Join the Web3 payroll revolution. Start automating payments and
              earning yield today.
            </p>
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
