"use client";

import { Building2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-[#2A190F]/10 border-b bg-[#F2E2C4]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F2E2C4]/90">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          href="/"
        >
          <Image
            alt="Piña mascot"
            className="h-12 w-12"
            height={50}
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
            width={50}
          />
          <span className="font-bold text-2xl text-[#2A190F]">
            Ananá Payroll
          </span>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full bg-[#FCBA2E] px-6 font-semibold text-[#2A190F] hover:bg-[#F1C644]">
              Login
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 border-2 border-[#2A190F]/10 bg-white p-4">
            <div className="space-y-3">
              <p className="mb-4 text-center font-medium text-[#2A190F] text-sm">
                Selecione seu tipo de acesso
              </p>
              <Link className="block" href="/employer/login">
                <Button
                  className="h-12 w-full justify-start gap-3 bg-[#FCBA2E] font-semibold text-[#2A190F] hover:bg-[#F1C644]"
                  variant="default"
                >
                  <Building2 className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Empregador</div>
                    <div className="text-xs opacity-80">
                      Gerir equipa e folha de pagamento
                    </div>
                  </div>
                </Button>
              </Link>
              <Link className="block" href="/employee/login">
                <Button
                  className="h-12 w-full justify-start gap-3 bg-[#2A190F] font-semibold text-[#F2E2C4] hover:bg-[#2A190F]/90"
                  variant="default"
                >
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Funcionário</div>
                    <div className="text-xs opacity-80">
                      Ver pagamentos e documentos
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
