"use client";

import {
  Clock,
  DollarSign,
  Download,
  LogOut,
  Send,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#F2E2C4]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-[#2A190F]/10 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center gap-3" href="/">
            <Image
              alt="Piña mascot"
              className="h-10 w-10"
              height={40}
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              width={40}
            />
            <span className="font-bold text-[#2A190F] text-xl">
              Ananá Payroll
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost">
              <Settings className="h-5 w-5 text-[#2A190F]" />
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link href="/">
                <LogOut className="h-5 w-5 text-[#2A190F]" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl text-[#2A190F]">
            Employer Dashboard
          </h1>
          <p className="text-[#2A190F]/70">
            Manage your team's payroll and payments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">24</div>
              <p className="text-[#2A190F]/60 text-xs">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Monthly Payroll
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">$45,231</div>
              <p className="text-[#2A190F]/60 text-xs">Next payout in 5 days</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Pending Approvals
              </CardTitle>
              <Clock className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">3</div>
              <p className="text-[#2A190F]/60 text-xs">Timesheet approvals</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Cost Savings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">12%</div>
              <p className="text-[#2A190F]/60 text-xs">
                vs traditional payroll
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          className="space-y-4"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="border border-[#2A190F]/20 bg-white/50">
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="employees"
            >
              Employees
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="payments"
            >
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest payroll transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          Monthly Payroll - March
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Processed on Mar 28, 2024
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          Bonus Payment
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Processed on Mar 15, 2024
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          New Employee Onboarding
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Added on Mar 10, 2024
                        </p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common payroll tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]">
                    <Send className="mr-2 h-4 w-4" />
                    Run Payroll
                  </Button>
                  <Button
                    className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                    variant="outline"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add New Employee
                  </Button>
                  <Button
                    className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent className="space-y-4" value="employees">
            <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Employee List</CardTitle>
                <CardDescription>Manage your team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Marketing Manager",
                      salary: "$5,200",
                    },
                    {
                      name: "Michael Chen",
                      role: "Software Engineer",
                      salary: "$6,500",
                    },
                    {
                      name: "Emma Davis",
                      role: "Product Designer",
                      salary: "$5,800",
                    },
                    {
                      name: "James Wilson",
                      role: "Sales Representative",
                      salary: "$4,200",
                    },
                  ].map((employee) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                      key={employee.name}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          {employee.name}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          {employee.role}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">
                          {employee.salary}
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">per month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="payments">
            <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">
                  Payment History
                </CardTitle>
                <CardDescription>View all past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "Mar 28, 2024",
                      amount: "$45,231",
                      type: "Monthly Payroll",
                      status: "completed",
                    },
                    {
                      date: "Mar 15, 2024",
                      amount: "$8,500",
                      type: "Bonus Payment",
                      status: "completed",
                    },
                    {
                      date: "Feb 28, 2024",
                      amount: "$43,890",
                      type: "Monthly Payroll",
                      status: "completed",
                    },
                  ].map((payment) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4"
                      key={payment.type}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          {payment.type}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          {payment.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">
                          {payment.amount}
                        </p>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
