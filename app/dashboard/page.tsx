"use client";

import {
  Briefcase,
  CheckCircle2Icon,
  Clock,
  CoinsIcon,
  Filter,
  LayoutPanelLeftIcon,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const projects = [
    {
      title: "DeFi Protocol Audit",
      status: "In Progress",
      statusColor: "bg-green-100 text-green-700",
      description: "Smart contract security review for a new lending protocol.",
      role: "Employer",
      milestone: "Next Milestone: Code Freeze",
    },
    {
      title: "NFT Marketplace UI",
      status: "Completed",
      statusColor: "bg-gray-100 text-gray-700",
      description: "Front-end development for collectibles platform.",
      role: "Employee",
      updates: "3 New Updates",
    },
    {
      title: "DAO Governance Module",
      status: "In Progress",
      statusColor: "bg-green-100 text-green-700",
      description: "Building on-chain voting mechanism.",
      role: "Employee",
      progress: 75,
    },
  ];

  return (
    <div className="h-full w-full">
      <h1 className="pt-6 text-center font-bold text-[#2A190F] text-xl md:text-3xl">
        Dashboard
      </h1>

      <div className="space-y-6 px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-[#2A190F]/10 bg-white">
            <CardContent className="flex items-center gap-4 p-4">
              <CoinsIcon className="h-10 w-10 text-[#FCBA2E]" />
              <div className="flex-1">
                <p className="text-[#2A190F]/60 text-sm">Earned Tokens</p>
                <p className="font-bold text-2xl text-[#2A190F]">1,234</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/10 bg-white">
            <CardContent className="flex items-center gap-4 p-4">
              <LayoutPanelLeftIcon className="h-10 w-10 text-[#FCBA2E]" />
              <div className="flex-1">
                <p className="text-[#2A190F]/60 text-sm">Active Projects</p>
                <p className="font-bold text-2xl text-[#2A190F]">5</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#2A190F]/10 bg-white">
            <CardContent className="flex items-center gap-4 p-4">
              <CheckCircle2Icon className="h-10 w-10 text-[#FCBA2E]" />
              <div className="flex-1">
                <p className="text-[#2A190F]/60 text-sm">Completed</p>
                <p className="font-bold text-2xl text-[#2A190F]">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#2A190F] text-xl">My Projects</h2>
            <Button size="icon" variant="ghost">
              <Filter className="h-5 w-5 text-[#2A190F]" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <Link
                className="block h-full w-full"
                href={`/project/${project.title.toLowerCase().replace(/ /g, "-")}?role=${project.role.toLowerCase()}`}
                key={project.title}
              >
                <Card className="h-full w-full rounded-xl border-[#2A190F]/10 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-bold text-[#2A190F] text-lg">
                        {project.title}
                      </CardTitle>
                      <Badge
                        className={`${project.statusColor} border-0 font-normal`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-[#2A190F]/70 text-sm">
                      {project.description}
                    </p>
                    <Badge
                      className="border-[#FCBA2E]/30 bg-[#FCBA2E]/20 font-normal text-[#2A190F]"
                      variant="outline"
                    >
                      Role: {project.role}
                    </Badge>
                    {project.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-green-200">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="font-medium text-[#2A190F] text-sm">
                            {project.progress}% Complete
                          </span>
                        </div>
                      </div>
                    )}
                    {project.milestone && (
                      <p className="text-[#2A190F]/60 text-sm">
                        {project.milestone}
                      </p>
                    )}
                    {project.updates && (
                      <p className="text-[#2A190F]/60 text-sm">
                        {project.updates}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* No Projects Yet Card */}
            <Card className="rounded-xl border-2 border-[#FCBA2E]/30 border-dashed bg-[#FCBA2E]/10">
              <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                <div className="relative">
                  <Briefcase className="h-12 w-12 text-[#2A190F]/60" />
                  <div className="-bottom-1 -right-1 absolute">
                    <Clock className="h-4 w-4 text-[#2A190F]/60" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-[#2A190F] text-lg">
                    No Projects Yet
                  </h3>
                  <p className="text-[#2A190F]/60 text-sm">
                    Get started by creating a new project or finding work.
                  </p>
                </div>
                <Button className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]">
                  <Plus className="mr-2 h-4 w-4" />
                  Find Work
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-[#FCBA2E] text-[#2A190F] shadow-lg hover:bg-[#F1C644]"
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
