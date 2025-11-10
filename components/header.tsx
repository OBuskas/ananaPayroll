"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Building2, User } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2A190F]/10 bg-[#F2E2C4]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F2E2C4]/90">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
            alt="Piña mascot"
            width={50}
            height={50}
            className="h-12 w-12"
          />
          <span className="text-2xl font-bold text-[#2A190F]">Ananá Payroll</span>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-[#FCBA2E] text-[#2A190F] hover:bg-[#F1C644] font-semibold rounded-full px-6">
              Login
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-white border-2 border-[#2A190F]/10 p-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#2A190F] text-center mb-4">Selecione seu tipo de acesso</p>
              <Link href="/employer/login" className="block">
                <Button
                  className="w-full justify-start gap-3 bg-[#FCBA2E] text-[#2A190F] hover:bg-[#F1C644] font-semibold h-12"
                  variant="default"
                >
                  <Building2 className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Empregador</div>
                    <div className="text-xs opacity-80">Gerir equipa e folha de pagamento</div>
                  </div>
                </Button>
              </Link>
              <Link href="/employee/login" className="block">
                <Button
                  className="w-full justify-start gap-3 bg-[#2A190F] text-[#F2E2C4] hover:bg-[#2A190F]/90 font-semibold h-12"
                  variant="default"
                >
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Funcionário</div>
                    <div className="text-xs opacity-80">Ver pagamentos e documentos</div>
                  </div>
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
