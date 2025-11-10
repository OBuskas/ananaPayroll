"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployerLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login - in production, integrate with your auth system
    router.push("/employer/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F2E2C4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/50 backdrop-blur border-[#2A190F]/20">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              alt="Piña mascot"
              width={80}
              height={80}
              className="h-20 w-20"
            />
          </Link>
          <CardTitle className="text-2xl font-bold text-[#2A190F]">Employer Login</CardTitle>
          <CardDescription className="text-[#2A190F]/70">Access your payroll management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2A190F]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="employer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-[#2A190F]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2A190F]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-[#2A190F]/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-semibold shadow-[0_4px_0_0_#DD840E]"
            >
              Login
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Link href="/employer/signup" className="text-sm text-[#2A190F]/70 hover:text-[#2A190F]">
              Don't have an account? Sign up
            </Link>
            <div className="text-sm text-[#2A190F]/70">
              Are you an employee?{" "}
              <Link href="/employee/login" className="text-[#2A190F] hover:underline font-semibold">
                Login here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
