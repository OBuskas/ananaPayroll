"use client";

import {
  Calendar,
  DollarSign,
  Download,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
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

type Employee = {
  wallet: string;
  amount: bigint;
  frequency: bigint;
  lockPeriod: bigint;
  accepted: boolean;
  active: boolean;
};

type Payment = {
  id: bigint;
  company: string;
  employee: string;
  amount: bigint;
  releaseAt: bigint;
  claimed: boolean;
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

  const [activeTab, setActiveTab] = useState("overview");

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

        // Fetch company name
        const company = await companyRegistry.read.getCompany([companyId]);
        setCompanyName(company.name);

        // Fetch employee data
        const employeeData = await employeeRegistry.read.getEmployee([
          companyId,
          address,
        ]);

        if (!employeeData.exists) {
          setLoadingPage(false);
          return;
        }

        setEmployee({
          wallet: address,
          amount: employeeData.amount,
          frequency: employeeData.frequency,
          lockPeriod: employeeData.lockPeriod,
          accepted: employeeData.accepted,
          active: employeeData.active,
        });

        // Fetch payments for this employee
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
            if (paymentEmployee.toLowerCase() === address.toLowerCase()) {
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

        // Sort payments by releaseAt (newest first)
        paymentList.sort((a, b) => Number(b.releaseAt - a.releaseAt));
        setPayments(paymentList);

        // Find last payment (claimed)
        const claimedPayments = paymentList.filter((p) => p.claimed);
        if (claimedPayments.length > 0) {
          setLastPayment(claimedPayments[0]);
        }

        // Find next payment (not claimed and releaseAt in future or past but not claimed)
        const now = BigInt(Math.floor(Date.now() / 1000));
        const unclaimedPayments = paymentList.filter((p) => !p.claimed);
        if (unclaimedPayments.length > 0) {
          // Find the one with the earliest releaseAt that's in the past or near future
          const next = unclaimedPayments.reduce((prev, current) =>
            current.releaseAt < prev.releaseAt ? current : prev
          );
          setNextPayment(next);
        }

        // Calculate YTD earnings (all claimed payments this year)
        const currentYear = new Date().getFullYear();
        const yearStart = BigInt(
          Math.floor(new Date(currentYear, 0, 1).getTime() / 1000)
        );
        const ytdTotal = claimedPayments
          .filter((p) => p.releaseAt >= yearStart)
          .reduce((sum, p) => sum + p.amount, 0n);

        const decimals = (await mockUSDT?.read.decimals()) || BigInt(6);
        setYtdEarnings(Number(formatUnits(ytdTotal, Number(decimals))));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [
    companyRegistry,
    employeeRegistry,
    paymentVault,
    mockUSDT,
    address,
    isConnected,
    account,
    companyContractId,
    publicClient,
  ]);

  const handleClaim = async (paymentId: bigint) => {
    if (!(paymentVault && account)) {
      return;
    }

    try {
      const hash = await paymentVault.write.claim([paymentId], account);
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error claiming payment:", error);
      // eslint-disable-next-line no-alert
      alert("Error al reclamar el pago");
    }
  };

  const formatAmount = (amount: bigint, decimals = 6) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(formatUnits(amount, decimals)));

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

  if (loadingPage) {
    return <AnanaLoading />;
  }

  if (!(employee && employee.exists)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-[#2A190F]">
              No se encontró información de empleado para esta compañía.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const decimals = 6; // USDT typically has 6 decimals

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
              {nextPayment
                ? getDaysUntil(nextPayment.releaseAt) > 0
                  ? `In ${getDaysUntil(nextPayment.releaseAt)} days`
                  : "Available now"
                : "No pending payments"}
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
              Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {payments.length}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Payment records</p>
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
                      No hay pagos registrados
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
                {nextPayment && !nextPayment.claimed && (
                  <Button
                    className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                    onClick={() => handleClaim(nextPayment.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Claim Payment
                  </Button>
                )}
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
                    No hay pagos registrados
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
              <CardDescription>
                Access your employment documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                    key={Number(payment.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#2A190F]/60" />
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          Pay Stub - Payment #{Number(payment.id)}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          Pay Stub • {formatDate(payment.releaseAt)}
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
                {payments.length === 0 && (
                  <p className="text-[#2A190F]/60 text-sm">
                    No hay documentos disponibles
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
