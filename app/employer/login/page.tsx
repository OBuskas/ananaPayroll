"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in production, integrate with your auth system
    router.push("/employer/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2E2C4] p-4">
      <Card className="w-full max-w-md border-[#2A190F]/20 bg-white/50 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <Link className="mb-4 flex justify-center" href="/">
            <Image
              alt="Piña mascot"
              className="h-20 w-20"
              height={80}
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              width={80}
            />
          </Link>
          <CardTitle className="font-bold text-2xl text-[#2A190F]">
            Employer Login
          </CardTitle>
          <CardDescription className="text-[#2A190F]/70">
            Access your payroll management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="email">
                Email
              </Label>
              <Input
                className="border-[#2A190F]/20 bg-white"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employer@company.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="password">
                Password
              </Label>
              <Input
                className="border-[#2A190F]/20 bg-white"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>
            <Button
              className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              type="submit"
            >
              Login
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center">
            <Link
              className="text-[#2A190F]/70 text-sm hover:text-[#2A190F]"
              href="/employer/signup"
            >
              Don't have an account? Sign up
            </Link>
            <div className="text-[#2A190F]/70 text-sm">
              Are you an employee?{" "}
              <Link
                className="font-semibold text-[#2A190F] hover:underline"
                href="/employee/login"
              >
                Login here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
