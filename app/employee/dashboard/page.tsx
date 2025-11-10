"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, FileText, Download, Settings, LogOut, TrendingUp } from "lucide-react"

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-[#F2E2C4]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#2A190F]/10 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pina-po0AP8bgiOjirYHeqCSaqKPKflcLOy.png"
              alt="Piña mascot"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[#2A190F]">Ananá Payroll</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-[#2A190F]" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <LogOut className="h-5 w-5 text-[#2A190F]" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2A190F] mb-2">Employee Dashboard</h1>
          <p className="text-[#2A190F]/70">View your payments and documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Last Payment</CardTitle>
              <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">$5,200</div>
              <p className="text-xs text-[#2A190F]/60">Received Mar 28, 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">Apr 28</div>
              <p className="text-xs text-[#2A190F]/60">In 5 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">YTD Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">$15,600</div>
              <p className="text-xs text-[#2A190F]/60">January - March 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Documents</CardTitle>
              <FileText className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">8</div>
              <p className="text-xs text-[#2A190F]/60">Available to download</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/50 border border-[#2A190F]/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FCBA2E]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-[#FCBA2E]">
              Payment History
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-[#FCBA2E]">
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">Recent Payments</CardTitle>
                  <CardDescription>Your latest salary payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#2A190F]/5">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">March 2024 Salary</p>
                        <p className="text-xs text-[#2A190F]/60">Mar 28, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 text-xs">Received</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#2A190F]/5">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">February 2024 Salary</p>
                        <p className="text-xs text-[#2A190F]/60">Feb 28, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 text-xs">Received</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#2A190F]/5">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">January 2024 Salary</p>
                        <p className="text-xs text-[#2A190F]/60">Jan 28, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">$5,200</p>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 text-xs">Received</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">Quick Access</CardTitle>
                  <CardDescription>Common actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-semibold shadow-[0_4px_0_0_#DD840E]">
                    <Download className="mr-2 h-4 w-4" />
                    Download Pay Stub
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#2A190F]/20 hover:bg-[#2A190F]/5 bg-transparent"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Tax Documents
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#2A190F]/20 hover:bg-[#2A190F]/5 bg-transparent"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Update Bank Details
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Employment Details</CardTitle>
                <CardDescription>Your current employment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#2A190F]/60">Position</p>
                    <p className="font-medium text-[#2A190F]">Marketing Manager</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2A190F]/60">Department</p>
                    <p className="font-medium text-[#2A190F]">Marketing</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2A190F]/60">Start Date</p>
                    <p className="font-medium text-[#2A190F]">January 15, 2022</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2A190F]/60">Employee ID</p>
                    <p className="font-medium text-[#2A190F]">EMP-00124</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Payment History</CardTitle>
                <CardDescription>All your salary payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: "March 2024", amount: "$5,200", date: "Mar 28, 2024", status: "completed" },
                    { month: "February 2024", amount: "$5,200", date: "Feb 28, 2024", status: "completed" },
                    { month: "January 2024", amount: "$5,200", date: "Jan 28, 2024", status: "completed" },
                    { month: "December 2023", amount: "$5,000", date: "Dec 28, 2023", status: "completed" },
                    { month: "November 2023", amount: "$5,000", date: "Nov 28, 2023", status: "completed" },
                  ].map((payment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#2A190F]/10 hover:bg-[#2A190F]/5 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">{payment.month}</p>
                        <p className="text-sm text-[#2A190F]/60">{payment.date}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-[#2A190F]">{payment.amount}</p>
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

          <TabsContent value="documents" className="space-y-4">
            <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Your Documents</CardTitle>
                <CardDescription>Access your employment documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "W-2 Form 2023", type: "Tax Document", date: "Jan 31, 2024" },
                    { name: "Pay Stub - March 2024", type: "Pay Stub", date: "Mar 28, 2024" },
                    { name: "Pay Stub - February 2024", type: "Pay Stub", date: "Feb 28, 2024" },
                    { name: "Benefits Summary", type: "Benefits", date: "Jan 01, 2024" },
                    { name: "Employment Contract", type: "Contract", date: "Jan 15, 2022" },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#2A190F]/10 hover:bg-[#2A190F]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#2A190F]/60" />
                        <div>
                          <p className="font-medium text-[#2A190F]">{doc.name}</p>
                          <p className="text-sm text-[#2A190F]/60">
                            {doc.type} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F]">
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
  )
}
