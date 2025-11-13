"use client";

import {
  Calendar,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContracts } from "@/context/contracts-context";
import { useDownloadRoot } from "@/hooks/use-download-root";

type Employee = {
  wallet: string;
  amount: bigint;
  frequency: bigint;
  lockPeriod: bigint;
  accepted: boolean;
  active: boolean;
  exists: boolean;
};

type Payment = {
  id: bigint;
  company: string;
  employee: string;
  amount: bigint;
  releaseAt: bigint;
  claimed: boolean;
};

type EmployeeDocument = {
  employee: string;
  pieceCid: string;
  fileName: string;
  fileSize: bigint;
  uploader: string;
  uploadedAt: bigint;
};

export default function EmployeeDashboard({
  companyContractId,
}: {
  companyContractId: string;
}) {
  const [loadingPage, setLoadingPage] = useState(true);
  const {
    companyRegistry,
    employeeRegistry,
    paymentVault,
    mockUSDT,
    address,
    isConnected,
    account,
  } = useContracts();
  const publicClient = usePublicClient();

  const [companyName, setCompanyName] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);
  const [nextPayment, setNextPayment] = useState<Payment | null>(null);
  const [ytdEarnings, setYtdEarnings] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState<bigint>(BigInt(0));
  const [claimingPaymentId, setClaimingPaymentId] = useState<bigint | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);

  const fetchCompanyName = useCallback(
    async (companyId: bigint) => {
      if (!companyRegistry) {
        return "";
      }
      const company = await companyRegistry.read.getCompany([companyId]);
      return company.name;
    },
    [companyRegistry]
  );

  const fetchEmployeeData = useCallback(
    async (companyId: bigint) => {
      if (!employeeRegistry) {
        return null;
      }
      if (!address) {
        return null;
      }
      return await employeeRegistry.read.getEmployee([companyId, address]);
    },
    [employeeRegistry, address]
  );

  const fetchPaymentsForEmployee = useCallback(
    async (employeeAddress: string): Promise<Payment[]> => {
      if (!paymentVault) {
        return [];
      }
      const nextPaymentId = await paymentVault.read.nextPaymentId();
      const paymentList: Payment[] = [];

      for (let i = BigInt(0); i < nextPaymentId; i++) {
        try {
          const payment = await paymentVault.read.payments([i]);
          const [
            id,
            paymentCompany,
            paymentEmployee,
            amount,
            releaseAt,
            claimed,
          ] = payment;
          if (paymentEmployee.toLowerCase() === employeeAddress.toLowerCase()) {
            paymentList.push({
              id,
              company: paymentCompany,
              employee: paymentEmployee,
              amount,
              releaseAt,
              claimed,
            });
          }
        } catch (err) {
          console.warn("Error fetching payment:", err);
        }
      }

      return paymentList.sort((a, b) => Number(b.releaseAt - a.releaseAt));
    },
    [paymentVault]
  );

  const processPayments = useCallback(
    async (paymentList: Payment[], claimedPayments: Payment[]) => {
      setPayments(paymentList);

      if (claimedPayments.length > 0) {
        setLastPayment(claimedPayments[0]);
      }

      const unclaimedPayments = paymentList.filter((p) => !p.claimed);
      if (unclaimedPayments.length > 0) {
        const next = unclaimedPayments.reduce((prev, current) =>
          current.releaseAt < prev.releaseAt ? current : prev
        );
        setNextPayment(next);
      }

      const currentYear = new Date().getFullYear();
      const yearStart = BigInt(
        Math.floor(new Date(currentYear, 0, 1).getTime() / 1000)
      );
      const ytdTotal = claimedPayments
        .filter((p) => p.releaseAt >= yearStart)
        .reduce((sum, p) => sum + p.amount, BigInt(0));

      const decimals = (await mockUSDT?.read.decimals()) || BigInt(6);
      setYtdEarnings(Number(formatUnits(ytdTotal, Number(decimals))));
    },
    [mockUSDT]
  );

  const fetchUsdtBalance = useCallback(async () => {
    if (!mockUSDT) {
      return;
    }
    if (!address) {
      return;
    }
    try {
      const balance = await mockUSDT.read.balanceOf([address]);
      setUsdtBalance(balance);
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  }, [mockUSDT, address]);

  const fetchEmployeeDocuments = useCallback(
    async (companyId: bigint) => {
      if (!(employeeRegistry && address)) {
        return;
      }
      try {
        const docs = await employeeRegistry.read.getEmployeeDocuments([
          companyId,
          address,
        ]);
        console.log("docs", docs);
        setDocuments(docs as unknown as EmployeeDocument[]);
      } catch (e) {
        console.warn("Error fetching docs:", e);
      }
    },
    [employeeRegistry, address]
  );

  useEffect(() => {
    if (
      !(
        companyRegistry &&
        employeeRegistry &&
        paymentVault &&
        address &&
        isConnected &&
        account &&
        publicClient
      )
    ) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const companyId = BigInt(companyContractId);

        const name = await fetchCompanyName(companyId);
        setCompanyName(name);

        const employeeData = await fetchEmployeeData(companyId);
        console.log("employeeData", employeeData);

        if (!employeeData?.exists) {
          return;
        }

        setEmployee(employeeData);

        if (!address) {
          return;
        }
        const paymentList = await fetchPaymentsForEmployee(address);
        const claimedPayments = paymentList.filter((p) => p.claimed);
        await processPayments(paymentList, claimedPayments);
        await fetchUsdtBalance();
        await fetchEmployeeDocuments(companyId);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [
    companyContractId,
    companyRegistry,
    employeeRegistry,
    paymentVault,
    fetchCompanyName,
    fetchEmployeeData,
    fetchPaymentsForEmployee,
    processPayments,
    fetchUsdtBalance,
    address,
    isConnected,
    account,
    publicClient,
  ]);

  const handleClaim = async (paymentId: bigint) => {
    if (!(paymentVault && account)) {
      toast.error("Cannot connect to contract");
      return;
    }

    try {
      setClaimingPaymentId(paymentId);
      toast.loading("Processing payment claim...", { id: "claim" });
      const hash = await paymentVault.write.claim([paymentId], account);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success("Payment claimed successfully!", { id: "claim" });
        // Refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error claiming payment:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error claiming payment";
      toast.error(errorMessage, { id: "claim" });
    } finally {
      setClaimingPaymentId(null);
    }
  };

  const handleViewTaxDocuments = () => {
    toast.info("Coming soon: Tax documents available", {
      duration: 3000,
    });
  };

  const handleUpdateBankDetails = () => {
    toast.info("Coming soon: Bank details update", {
      duration: 3000,
    });
  };

  const formatAmount = (amount: bigint, tokenDecimals = 6) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(formatUnits(amount, tokenDecimals)));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (timestamp: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = Number(timestamp) - now;
    const days = Math.ceil(diff / (60 * 60 * 24));
    return days;
  };

  const getNextPaymentStatus = (payment: Payment | null): string => {
    if (!payment) {
      return "No pending payments";
    }
    const days = getDaysUntil(payment.releaseAt);
    if (days > 0) {
      return `In ${days} days`;
    }
    return "Available now";
  };

  const hasAvailablePayments = (): boolean => {
    if (!nextPayment || nextPayment.claimed) {
      return false;
    }
    const days = getDaysUntil(nextPayment.releaseAt);
    return days <= 0;
  };

  if (loadingPage) {
    return <AnanaLoading />;
  }

  if (!employee?.exists) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-[#2A190F]">
              No employee information found for this company.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decimals = 6; // MockUSDT has 6 decimals

  return (
    <div className="h-full w-full">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-[#2A190F] capitalize">
          {companyName || "Loading..."}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Last Payment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {lastPayment
                ? formatAmount(lastPayment.amount, decimals)
                : "$0.00"}
            </div>
            <p className="text-[#2A190F]/60 text-xs">
              {lastPayment
                ? `Received ${formatDate(lastPayment.releaseAt)}`
                : "No payments yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Next Payment
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {nextPayment ? formatDate(nextPayment.releaseAt) : "N/A"}
            </div>
            <p className="text-[#2A190F]/60 text-xs">
              {getNextPaymentStatus(nextPayment)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              YTD Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {formatAmount(
                BigInt(Math.floor(ytdEarnings * 1_000_000)),
                decimals
              )}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              USDT Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {formatAmount(usdtBalance, decimals)}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        className="space-y-4"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A190F]">
                  Recent Payments
                </CardTitle>
                <CardDescription>Your latest salary payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 3).map((payment) => (
                    <div
                      className="flex items-center justify-between rounded-lg bg-[#2A190F]/5 p-3"
                      key={Number(payment.id)}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F] text-sm">
                          Payment #{Number(payment.id)}
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">
                          {formatDate(payment.releaseAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">
                          {formatAmount(payment.amount, decimals)}
                        </p>
                        <Badge
                          className={
                            payment.claimed
                              ? "bg-green-500/20 text-green-700 text-xs hover:bg-green-500/30"
                              : "bg-yellow-500/20 text-xs text-yellow-700 hover:bg-yellow-500/30"
                          }
                        >
                          {payment.claimed ? "Received" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <p className="text-[#2A190F]/60 text-sm">
                      No payments registered
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Quick Access</CardTitle>
                <CardDescription>Common actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextPayment && !nextPayment.claimed ? (
                  <Button
                    className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                    disabled={
                      claimingPaymentId !== null || !hasAvailablePayments()
                    }
                    onClick={() => handleClaim(nextPayment.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {claimingPaymentId === nextPayment.id
                      ? "Processing..."
                      : "Claim Payment"}
                  </Button>
                ) : (
                  <Button
                    className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                    disabled
                  >
                    <Download className="mr-2 h-4 w-4" />
                    No Payment Available
                  </Button>
                )}
                <Button
                  className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={handleViewTaxDocuments}
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Tax Documents
                </Button>
                <Button
                  className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={handleUpdateBankDetails}
                  variant="outline"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Update Bank Details
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
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
                  <p className="text-[#2A190F]/60 text-sm">Payment Amount</p>
                  <p className="font-medium text-[#2A190F]">
                    {formatAmount(employee.amount, decimals)}
                  </p>
                </div>
                <div>
                  <p className="text-[#2A190F]/60 text-sm">Payment Frequency</p>
                  <p className="font-medium text-[#2A190F]">
                    {Number(employee.frequency) / (60 * 60 * 24)} days
                  </p>
                </div>
                <div>
                  <p className="text-[#2A190F]/60 text-sm">Lock Period</p>
                  <p className="font-medium text-[#2A190F]">
                    {Number(employee.lockPeriod) / (60 * 60 * 24)} days
                  </p>
                </div>
                <div>
                  <p className="text-[#2A190F]/60 text-sm">Status</p>
                  <p className="font-medium text-[#2A190F]">
                    {employee.accepted ? (
                      <Badge className="bg-green-500/20 text-green-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-700">
                        Pending Acceptance
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2A190F]">Payment History</CardTitle>
              <CardDescription>All your salary payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-[#2A190F]/60 text-sm">
                    No payments registered
                  </p>
                ) : (
                  payments.map((payment) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                      key={Number(payment.id)}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          Payment #{Number(payment.id)}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          {formatDate(payment.releaseAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="font-semibold text-[#2A190F]">
                            {formatAmount(payment.amount, decimals)}
                          </p>
                          <Badge
                            className={
                              payment.claimed
                                ? "bg-green-500/20 text-green-700 hover:bg-green-500/30"
                                : "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
                            }
                          >
                            {payment.claimed ? "Claimed" : "Pending"}
                          </Badge>
                        </div>
                        {!payment.claimed && (
                          <Button
                            disabled={
                              (claimingPaymentId !== null &&
                                claimingPaymentId === payment.id) ||
                              getDaysUntil(payment.releaseAt) > 0
                            }
                            onClick={() => handleClaim(payment.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2A190F]">Your Documents</CardTitle>
              <CardDescription>Files assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <p className="text-[#2A190F]/60 text-sm">No documents</p>
                ) : (
                  documents.map((doc) => (
                    <EmployeeDocRow doc={doc} key={doc.pieceCid} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmployeeDocRow({ doc }: { doc: EmployeeDocument }) {
  const { downloadMutation } = useDownloadRoot(doc.pieceCid, doc.fileName);
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4">
      <div className="min-w-0">
        <p className="truncate font-medium text-[#2A190F]">{doc.fileName}</p>
        <p className="text-[#2A190F]/60 text-xs">
          CID: {doc.pieceCid.slice(0, 8)}...{doc.pieceCid.slice(-6)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
          onClick={() => downloadMutation.mutate()}
          size="sm"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
          onClick={async () => {
            await navigator.clipboard.writeText(doc.pieceCid);
          }}
          size="sm"
          variant="outline"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
