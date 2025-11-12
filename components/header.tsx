"use client";

import Image from "next/image";
import Link from "next/link";
import AuthButton from "./auth-button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-[#2A190F]/10 border-b bg-[#F2E2C4]/95 backdrop-blur supports-backdrop-filter:bg-[#F2E2C4]/90">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          href="/"
        >
          <div className="relative aspect-square w-12">
            <Image
              alt="Piña mascot"
              className="object-contain"
              fill
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
            />
          </div>
          <span className="font-bold font-jersey25 text-2xl text-[#2A190F]">
            Ananá Payroll
          </span>
        </Link>

        <AuthButton />
      </div>
    </header>
  );
}
