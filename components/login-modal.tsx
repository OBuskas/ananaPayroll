"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#F2E2C4] border-[#2A190F]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2A190F] text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="employer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2A190F]/10">
            <TabsTrigger value="employer" className="data-[state=active]:bg-[#FCBA2E]">
              Employer
            </TabsTrigger>
            <TabsTrigger value="employee" className="data-[state=active]:bg-[#FCBA2E]">
              Employee
            </TabsTrigger>
          </TabsList>
          <TabsContent value="employer" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="employer-email">Email</Label>
              <Input id="employer-email" type="email" placeholder="employer@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer-password">Password</Label>
              <Input id="employer-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-semibold">
              Login as Employer
            </Button>
          </TabsContent>
          <TabsContent value="employee" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="employee-email">Email</Label>
              <Input id="employee-email" type="email" placeholder="employee@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-password">Password</Label>
              <Input id="employee-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-semibold">
              Login as Employee
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
