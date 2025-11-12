"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";
import AnanaLoading from "@/components/anana-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContracts } from "@/context/contracts-context";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get("companyId");
  const employeeAddressParam = searchParams.get("employee");
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    companyName: string;
    amount: bigint;
    frequency: bigint;
    lockPeriod: bigint;
    exists: boolean;
    accepted: boolean;
    active: boolean;
  } | null>(null);

  const { companyRegistry, employeeRegistry, address, isConnected, account } =
    useContracts();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!companyIdParam) {
      setLoading(false);
      return;
    }

    if (
      !(
        companyRegistry &&
        employeeRegistry &&
        address &&
        isConnected &&
        account &&
        publicClient
      )
    ) {
      return;
    }

    // Validate that connected wallet matches the employee address in the link
    if (
      employeeAddressParam &&
      address.toLowerCase() !== employeeAddressParam.toLowerCase()
    ) {
      setLoading(false);
      return;
    }

    const fetchInvitationData = async () => {
      try {
        setLoading(true);
        const companyId = BigInt(companyIdParam);

        // Fetch company name
        const company = await companyRegistry.read.getCompany([companyId]);
        if (!company.exists) {
          setInvitationData(null);
          setLoading(false);
          return;
        }

        // Fetch employee data - use address from link if provided, otherwise use connected address
        const employeeWallet = (employeeAddressParam ||
          address) as `0x${string}`;
        const employee = await employeeRegistry.read.getEmployee([
          companyId,
          employeeWallet,
        ]);

        if (!employee.exists) {
          setInvitationData(null);
          setLoading(false);
          return;
        }

        setInvitationData({
          companyName: company.name,
          amount: employee.amount,
          frequency: employee.frequency,
          lockPeriod: employee.lockPeriod,
          exists: employee.exists,
          accepted: employee.accepted,
          active: employee.active,
        });
      } catch (error) {
        console.error("Error fetching invitation data:", error);
        setInvitationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationData();
  }, [
    companyIdParam,
    employeeAddressParam,
    companyRegistry,
    employeeRegistry,
    address,
    isConnected,
    account,
    publicClient,
  ]);

  const handleAccept = async () => {
    if (!(employeeRegistry && account && companyIdParam)) {
      return;
    }

    try {
      setAccepting(true);
      const companyId = BigInt(companyIdParam);

      const hash = await employeeRegistry.write.acceptJob([companyId], account);

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success("¡Invitación aceptada exitosamente!");
        // Refresh data
        setTimeout(() => {
          window.location.href = `/project/${companyIdParam}`;
        }, 1500);
      }
    } catch (error: unknown) {
      console.error("Error accepting invitation:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error al aceptar la invitación";
      toast.error(errorMessage);
    } finally {
      setAccepting(false);
    }
  };

  const formatAmount = (amount: bigint, tokenDecimals = 6) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(formatUnits(amount, tokenDecimals)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AnanaLoading />
      </div>
    );
  }

  if (!companyIdParam) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-[#2A190F]">Link Inválido</CardTitle>
            <CardDescription>
              El link de invitación no contiene la información necesaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Por favor, solicita un nuevo link de invitación al empleador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!(isConnected && address)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-[#2A190F]">Conecta tu Wallet</CardTitle>
            <CardDescription>
              Necesitas conectar tu wallet para aceptar la invitación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Por favor, conecta la wallet que recibió la invitación para
              continuar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if connected wallet matches the employee address in the link
  if (
    employeeAddressParam &&
    address.toLowerCase() !== employeeAddressParam.toLowerCase()
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-[#2A190F]">Wallet Incorrecta</CardTitle>
            <CardDescription>
              La wallet conectada no coincide con la invitación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-[#2A190F]/60 text-sm">
              Esta invitación es para la wallet:
            </p>
            <p className="mb-4 break-all font-mono text-[#2A190F] text-xs">
              {employeeAddressParam}
            </p>
            <p className="text-[#2A190F]/60 text-sm">
              Por favor, desconecta la wallet actual y conecta la wallet
              correcta para aceptar esta invitación.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-[#2A190F]">
              Invitación No Encontrada
            </CardTitle>
            <CardDescription>
              No se encontró una invitación pendiente para esta wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Verifica que estés usando la wallet correcta o contacta al
              empleador para una nueva invitación.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitationData.accepted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2A190F]">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Invitación Ya Aceptada
            </CardTitle>
            <CardDescription>
              Esta invitación ya fue aceptada previamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-[#2A190F]">
                {invitationData.companyName}
              </p>
              <p className="text-[#2A190F]/60 text-sm">
                Ya eres parte de esta empresa
              </p>
            </div>
            <Button
              className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              onClick={() => {
                window.location.href = `/project/${companyIdParam}`;
              }}
            >
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationData.active) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2A190F]">
              <XCircle className="h-5 w-5 text-red-600" />
              Invitación Inactiva
            </CardTitle>
            <CardDescription>Esta invitación ya no está activa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              La invitación ha sido cancelada o desactivada. Contacta al
              empleador para más información.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decimals = 6; // USDT typically has 6 decimals

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#2A190F]">Invitación de Empleo</CardTitle>
          <CardDescription>
            Has sido invitado a unirte a una empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-1 text-[#2A190F]/60 text-sm">Empresa</p>
            <p className="font-semibold text-[#2A190F] text-lg">
              {invitationData.companyName}
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-[#2A190F]/10 p-4">
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">Monto por Pago</span>
              <span className="font-semibold text-[#2A190F]">
                {formatAmount(invitationData.amount, decimals)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">
                Frecuencia de Pago
              </span>
              <span className="font-semibold text-[#2A190F]">
                {Number(invitationData.frequency) / (24 * 60 * 60)} días
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">
                Período de Bloqueo
              </span>
              <span className="font-semibold text-[#2A190F]">
                {Number(invitationData.lockPeriod) / (24 * 60 * 60)} días
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <Badge className="bg-yellow-500/20 text-yellow-700">
              Pendiente
            </Badge>
            <p className="text-[#2A190F]/60 text-xs">
              Acepta esta invitación para comenzar a recibir pagos
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              disabled={accepting}
              onClick={handleAccept}
            >
              {accepting ? "Aceptando..." : "Aceptar Invitación"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
