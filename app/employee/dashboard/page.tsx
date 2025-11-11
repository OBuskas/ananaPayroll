"use client";

import {
  Calendar,
  DollarSign,
  Download,
  FileText,
  LogOut,
  Settings,
  TrendingUp,
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

export default function EmployeeDashboard() {
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
            Employee Dashboard
          </h1>
          <p className="text-[#2A190F]/70">View your payments and documents</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Last Payment
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">$5,200</div>
              <p className="text-[#2A190F]/60 text-xs">Received Mar 28, 2024</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Next Payment
              </CardTitle>
              <Calendar className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">Apr 28</div>
              <p className="text-[#2A190F]/60 text-xs">In 5 days</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                YTD Earnings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">$15,600</div>
              <p className="text-[#2A190F]/60 text-xs">January - March 2024</p>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-[#2A190F] text-sm">
                Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-[#2A190F]">8</div>
              <p className="text-[#2A190F]/60 text-xs">Available to download</p>
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
              value="payments"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#FCBA2E]"
              value="documents"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">
                    Recent Payments
                  </CardTitle>
                  <CardDescription>Your latest salary payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-[#2A190F]/5 p-3">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          March 2024 Salary
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Mar 28, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 text-xs hover:bg-green-500/30">
                          Received
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A190F]/5 p-3">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          February 2024 Salary
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Feb 28, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 text-xs hover:bg-green-500/30">
                          Received
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A190F]/5 p-3">
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          January 2024 Salary
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          Jan 28, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 text-xs hover:bg-green-500/30">
                          Received
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">Quick Access</CardTitle>
                  <CardDescription>Common actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]">
                    <Download className="mr-2 h-4 w-4" />
                    Download Pay Stub
                  </Button>
                  <Button
                    className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                    variant="outline"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Tax Documents
                  </Button>
                  <Button
                    className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                    variant="outline"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Update Bank Details
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">
                  Employment Details
                </CardTitle>
                <CardDescription>
                  Your current employment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[#2A190F]/60 text-sm">Position</p>
                    <p className="font-medium text-[#2A190F]">
                      Marketing Manager
                    </p>
                  </div>
                  <div>
                    <p className="text-[#2A190F]/60 text-sm">Department</p>
                    <p className="font-medium text-[#2A190F]">Marketing</p>
                  </div>
                  <div>
                    <p className="text-[#2A190F]/60 text-sm">Start Date</p>
                    <p className="font-medium text-[#2A190F]">
                      January 15, 2022
                    </p>
                  </div>
                  <div>
                    <p className="text-[#2A190F]/60 text-sm">Employee ID</p>
                    <p className="font-medium text-[#2A190F]">EMP-00124</p>
                  </div>
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
                <CardDescription>All your salary payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      month: "March 2024",
                      amount: "$5,200",
                      date: "Mar 28, 2024",
                      status: "completed",
                    },
                    {
                      month: "February 2024",
                      amount: "$5,200",
                      date: "Feb 28, 2024",
                      status: "completed",
                    },
                    {
                      month: "January 2024",
                      amount: "$5,200",
                      date: "Jan 28, 2024",
                      status: "completed",
                    },
                    {
                      month: "December 2023",
                      amount: "$5,000",
                      date: "Dec 28, 2023",
                      status: "completed",
                    },
                    {
                      month: "November 2023",
                      amount: "$5,000",
                      date: "Nov 28, 2023",
                      status: "completed",
                    },
                  ].map((payment) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                      key={payment.month}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          {payment.month}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          {payment.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="font-semibold text-[#2A190F]">
                            {payment.amount}
                          </p>
                          <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                            {payment.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent className="space-y-4" value="documents">
            <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Your Documents</CardTitle>
                <CardDescription>
                  Access your employment documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "W-2 Form 2023",
                      type: "Tax Document",
                      date: "Jan 31, 2024",
                    },
                    {
                      name: "Pay Stub - March 2024",
                      type: "Pay Stub",
                      date: "Mar 28, 2024",
                    },
                    {
                      name: "Pay Stub - February 2024",
                      type: "Pay Stub",
                      date: "Feb 28, 2024",
                    },
                    {
                      name: "Benefits Summary",
                      type: "Benefits",
                      date: "Jan 01, 2024",
                    },
                    {
                      name: "Employment Contract",
                      type: "Contract",
                      date: "Jan 15, 2022",
                    },
                  ].map((doc) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                      key={doc.name}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#2A190F]/60" />
                        <div>
                          <p className="font-medium text-[#2A190F]">
                            {doc.name}
                          </p>
                          <p className="text-[#2A190F]/60 text-sm">
                            {doc.type} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="bg-[#FCBA2E] text-[#2A190F] hover:bg-[#F1C644]"
                        size="sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
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
