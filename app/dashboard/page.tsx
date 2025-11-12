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
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import AnanaLoading from "@/components/anana-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContracts } from "@/context/contracts-context";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { companyRegistry, address, isConnected, account } = useContracts();
  const publicClient = usePublicClient();

  type Company = {
    id: number;
    name: string;
    admin: string;
    exists: boolean;
  };

  const [projects, setProjects] = useState<Company[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!(companyRegistry && isConnected && address && publicClient)) {
      return;
    }
    const fetchProjects = async () => {
      const companies: Company[] = [];

      let totalCompanies: bigint;
      try {
        totalCompanies = await companyRegistry.read.nextCompanyId();
      } catch (err) {
        console.warn("Error fetching nextCompanyId:", err);
        return [];
      }

      for (let i = 0; i < totalCompanies; i++) {
        try {
          const company = await companyRegistry.read.getCompany([BigInt(i)]);

          const isAdmin = await companyRegistry.read.isCompanyAdmin([
            BigInt(i),
            address,
          ]);

          if (isAdmin) {
            companies.push({
              id: i,
              name: company.name,
              admin: company.admin,
              exists: company.exists,
            });
          }
        } catch (err) {
          console.warn("Error fetching company:", err);
        }
      }

      setProjects(companies);
      setLoadingProjects(false);
    };

    fetchProjects();
  }, [companyRegistry, isConnected, address, publicClient]);

  const handleCreateOrganization = async () => {
    if (
      !(
        organizationName.trim() &&
        companyRegistry &&
        publicClient &&
        address &&
        account
      )
    ) {
      return;
    }

    try {
      const hash = await companyRegistry.write.registerCompany(
        [organizationName.trim()],
        account
      );
      await publicClient.waitForTransactionReceipt({ hash });
      setIsModalOpen(false);
      setOrganizationName("");
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <p className="font-bold text-2xl text-[#2A190F]">
                  {projects.length}
                </p>
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

          {loadingProjects ? (
            <AnanaLoading />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {projects.map((project) => (
                <Link
                  className="block h-full w-full"
                  href={`/project/${project.id}`}
                  key={project.id}
                >
                  <Card className="h-full w-full rounded-xl border-[#2A190F]/10 bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="font-bold text-[#2A190F] text-lg">
                          {project.name}
                        </CardTitle>
                        <Badge className="border-0 bg-green-500/20 font-normal text-green-700">
                          Activa
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-[#2A190F]/70 text-sm">
                        Organización registrada en la blockchain
                      </p>
                      <Badge
                        className="border-[#FCBA2E]/30 bg-[#FCBA2E]/20 font-normal text-[#2A190F]"
                        variant="outline"
                      >
                        ID: {project.id}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {projects.length === 0 && (
                /* No Projects Yet Card */
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-[#FCBA2E] text-[#2A190F] shadow-lg hover:bg-[#F1C644]"
          onClick={() => setIsModalOpen(true)}
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Create Organization Modal */}
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#2A190F]">
              Crear Organización
            </DialogTitle>
            <DialogDescription className="text-[#2A190F]/70">
              Ingresa el nombre de la organización que deseas crear.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-[#2A190F]" htmlFor="organization-name">
                Nombre de la Organización
              </Label>
              <Input
                className="text-[#2A190F]"
                disabled={isLoading}
                id="organization-name"
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Ej: Mi Empresa S.A."
                value={organizationName}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="text-[#2A190F]"
              disabled={isLoading}
              onClick={() => setIsModalOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#FCBA2E] text-[#2A190F] hover:bg-[#F1C644]"
              disabled={
                !organizationName.trim() || isLoading || !companyRegistry
              }
              onClick={handleCreateOrganization}
            >
              {isLoading ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
