"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Clock, TrendingUp, Download, Send, Settings, LogOut } from "lucide-react"

export default function EmployerDashboard() {
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
          <h1 className="text-3xl font-bold text-[#2A190F] mb-2">Employer Dashboard</h1>
          <p className="text-[#2A190F]/70">Manage your team's payroll and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">24</div>
              <p className="text-xs text-[#2A190F]/60">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Monthly Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">$45,231</div>
              <p className="text-xs text-[#2A190F]/60">Next payout in 5 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">3</div>
              <p className="text-xs text-[#2A190F]/60">Timesheet approvals</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#2A190F]">Cost Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#2A190F]">12%</div>
              <p className="text-xs text-[#2A190F]/60">vs traditional payroll</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/50 border border-[#2A190F]/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FCBA2E]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-[#FCBA2E]">
              Employees
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-[#FCBA2E]">
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">Recent Activity</CardTitle>
                  <CardDescription>Latest payroll transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">Monthly Payroll - March</p>
                        <p className="text-xs text-[#2A190F]/60">Processed on Mar 28, 2024</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">Bonus Payment</p>
                        <p className="text-xs text-[#2A190F]/60">Processed on Mar 15, 2024</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#2A190F]">New Employee Onboarding</p>
                        <p className="text-xs text-[#2A190F]/60">Added on Mar 10, 2024</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
                <CardHeader>
                  <CardTitle className="text-[#2A190F]">Quick Actions</CardTitle>
                  <CardDescription>Common payroll tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-[#FCBA2E] hover:bg-[#F1C644] text-[#2A190F] font-semibold shadow-[0_4px_0_0_#DD840E]">
                    <Send className="mr-2 h-4 w-4" />
                    Run Payroll
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#2A190F]/20 hover:bg-[#2A190F]/5 bg-transparent"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add New Employee
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#2A190F]/20 hover:bg-[#2A190F]/5 bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Employee List</CardTitle>
                <CardDescription>Manage your team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", role: "Marketing Manager", salary: "$5,200" },
                    { name: "Michael Chen", role: "Software Engineer", salary: "$6,500" },
                    { name: "Emma Davis", role: "Product Designer", salary: "$5,800" },
                    { name: "James Wilson", role: "Sales Representative", salary: "$4,200" },
                  ].map((employee, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#2A190F]/10 hover:bg-[#2A190F]/5 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">{employee.name}</p>
                        <p className="text-sm text-[#2A190F]/60">{employee.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">{employee.salary}</p>
                        <p className="text-xs text-[#2A190F]/60">per month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card className="bg-white/50 backdrop-blur border-[#2A190F]/20">
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Payment History</CardTitle>
                <CardDescription>View all past transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Mar 28, 2024", amount: "$45,231", type: "Monthly Payroll", status: "completed" },
                    { date: "Mar 15, 2024", amount: "$8,500", type: "Bonus Payment", status: "completed" },
                    { date: "Feb 28, 2024", amount: "$43,890", type: "Monthly Payroll", status: "completed" },
                  ].map((payment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#2A190F]/10"
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">{payment.type}</p>
                        <p className="text-sm text-[#2A190F]/60">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">{payment.amount}</p>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{payment.status}</Badge>
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
  )
}
