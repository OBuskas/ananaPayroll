"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="border-[#2A190F]/20 bg-[#F2E2C4] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-2xl text-[#2A190F]">
            Welcome Back
          </DialogTitle>
        </DialogHeader>
        <Tabs className="w-full" defaultValue="employer">
          <TabsList className="grid w-full grid-cols-2 bg-[#2A190F]/10">
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="employer"
            >
              Employer
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="employee"
            >
              Employee
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4 space-y-4" value="employer">
            <div className="space-y-2">
              <Label htmlFor="employer-email">Email</Label>
              <Input
                id="employer-email"
                placeholder="employer@company.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer-password">Password</Label>
              <Input
                id="employer-password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <Button className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] hover:bg-[#F1C644]">
              Login as Employer
            </Button>
          </TabsContent>
          <TabsContent className="mt-4 space-y-4" value="employee">
            <div className="space-y-2">
              <Label htmlFor="employee-email">Email</Label>
              <Input
                id="employee-email"
                placeholder="employee@company.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-password">Password</Label>
              <Input
                id="employee-password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <Button className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] hover:bg-[#F1C644]">
              Login as Employee
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
