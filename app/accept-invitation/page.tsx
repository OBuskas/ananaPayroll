"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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

function AcceptInvitationContent() {
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
        toast.success("Invitation accepted successfully!");
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
        "Error accepting invitation";
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
            <CardTitle className="text-[#2A190F]">Invalid Link</CardTitle>
            <CardDescription>
              The invitation link does not contain the necessary information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Please request a new invitation link from the employer.
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
            <CardTitle className="text-[#2A190F]">
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              You need to connect your wallet to accept the invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Please connect the wallet that received the invitation to
              continue.
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
            <CardTitle className="text-[#2A190F]">Incorrect Wallet</CardTitle>
            <CardDescription>
              The connected wallet does not match the invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-[#2A190F]/60 text-sm">
              This invitation is for the wallet:
            </p>
            <p className="mb-4 break-all font-mono text-[#2A190F] text-xs">
              {employeeAddressParam}
            </p>
            <p className="text-[#2A190F]/60 text-sm">
              Please disconnect the current wallet and connect the correct
              wallet to accept this invitation.
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
              Invitation Not Found
            </CardTitle>
            <CardDescription>
              No pending invitation found for this wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              Verify that you are using the correct wallet or contact the
              employer for a new invitation.
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
              Invitation Already Accepted
            </CardTitle>
            <CardDescription>
              This invitation was already accepted previously
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-[#2A190F]">
                {invitationData.companyName}
              </p>
              <p className="text-[#2A190F]/60 text-sm">
                You are already part of this company
              </p>
            </div>
            <Button
              className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              onClick={() => {
                window.location.href = `/project/${companyIdParam}`;
              }}
            >
              Go to Dashboard
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
              Inactive Invitation
            </CardTitle>
            <CardDescription>
              This invitation is no longer active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#2A190F]/60 text-sm">
              The invitation has been canceled or deactivated. Contact the
              employer for more information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decimals = 6; // MockUSDT has 6 decimals

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#2A190F]">Job Invitation</CardTitle>
          <CardDescription>
            You have been invited to join a company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-1 text-[#2A190F]/60 text-sm">Company</p>
            <p className="font-semibold text-[#2A190F] text-lg">
              {invitationData.companyName}
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-[#2A190F]/10 p-4">
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">
                Amount per Payment
              </span>
              <span className="font-semibold text-[#2A190F]">
                {formatAmount(invitationData.amount, decimals)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">
                Payment Frequency
              </span>
              <span className="font-semibold text-[#2A190F]">
                {Number(invitationData.frequency) / (24 * 60 * 60)} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2A190F]/60 text-sm">Lock Period</span>
              <span className="font-semibold text-[#2A190F]">
                {Number(invitationData.lockPeriod) / (24 * 60 * 60)} days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <Badge className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
            <p className="text-[#2A190F]/60 text-xs">
              Accept this invitation to start receiving payments
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
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              disabled={accepting}
              onClick={handleAccept}
            >
              {accepting ? "Accepting..." : "Accept Invitation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <AnanaLoading />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
