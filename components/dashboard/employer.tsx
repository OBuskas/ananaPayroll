"use client";

import { Clock, Copy, DollarSign, Download, Send, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
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

const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function EmployerDashboard({
  companyContractId,
}: {
  companyContractId: string;
}) {
  const [loadingPage, setLoadingPage] = useState(true);
  const {
    companyRegistry,
    employeeRegistry,
    paymentVault,
    payrollManager,
    mockUSDT,
    address,
    isConnected,
    account,
  } = useContracts();
  const publicClient = usePublicClient();

  const [companyName, setCompanyName] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isRunningPayroll, setIsRunningPayroll] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    wallet: "",
    amount: "",
    frequencyDays: "",
    lockPeriodDays: "",
  });

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

    const fetchCompanyData = async (companyId: bigint) => {
      const company = await companyRegistry.read.getCompany([companyId]);
      setCompanyName(company.name);
      return company;
    };

    const fetchEmployees = async (
      companyId: bigint,
      client: typeof publicClient
    ) => {
      const employeeAddedEvents = await client.getLogs({
        address: employeeRegistry.address,
        event: {
          type: "event",
          name: "EmployeeAdded",
          inputs: [
            { type: "uint256", indexed: true, name: "companyId" },
            { type: "address", indexed: true, name: "employee" },
            { type: "uint256", indexed: false, name: "amount" },
            { type: "uint256", indexed: false, name: "frequency" },
            { type: "uint256", indexed: false, name: "lockPeriod" },
          ],
        },
        args: {
          companyId,
        },
        fromBlock: "earliest",
      });

      const employeeAddresses = new Set<string>();
      for (const event of employeeAddedEvents) {
        if (event.args.employee) {
          employeeAddresses.add(event.args.employee as string);
        }
      }

      const employeeList: Employee[] = [];
      for (const empAddress of employeeAddresses) {
        try {
          const employee = await employeeRegistry.read.getEmployee([
            companyId,
            empAddress as `0x${string}`,
          ]);

          if (employee.exists && employee.active) {
            employeeList.push({
              wallet: empAddress,
              amount: employee.amount,
              frequency: employee.frequency,
              lockPeriod: employee.lockPeriod,
              accepted: employee.accepted,
              active: employee.active,
            });
          }
        } catch (err) {
          console.warn("Error fetching employee:", err);
        }
      }

      return employeeList;
    };

    const fetchPayments = async (companyAdmin: string) => {
      const nextPaymentId = await paymentVault.read.nextPaymentId();
      const paymentList: Payment[] = [];

      for (let i = BigInt(0); i < nextPaymentId; i++) {
        try {
          const payment = await paymentVault.read.payments([i]);
          const [id, paymentCompany, employee, amount, releaseAt, claimed] =
            payment;
          if (paymentCompany.toLowerCase() === companyAdmin.toLowerCase()) {
            paymentList.push({
              id,
              company: paymentCompany,
              employee,
              amount,
              releaseAt,
              claimed,
            });
          }
        } catch (err) {
          console.warn("Error fetching payment:", err);
        }
      }

      paymentList.sort((a, b) => Number(b.releaseAt - a.releaseAt));
      return paymentList;
    };

    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const companyId = BigInt(companyContractId);

        const company = await fetchCompanyData(companyId);
        const employeeList = await fetchEmployees(companyId, publicClient);

        setEmployees(employeeList);
        setTotalEmployees(employeeList.length);

        const totalAmount = employeeList.reduce(
          (sum, emp) => sum + emp.amount,
          BigInt(0)
        );
        const decimals = (await mockUSDT?.read.decimals()) || BigInt(6);
        setMonthlyPayroll(Number(formatUnits(totalAmount, Number(decimals))));

        const paymentList = await fetchPayments(company.admin);
        setPayments(paymentList);

        const pending = employeeList.filter((emp) => !emp.accepted).length;
        setPendingApprovals(pending);
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

  const handleRunPayroll = async () => {
    if (!(payrollManager && account && employeeRegistry && address)) {
      return;
    }

    try {
      setIsRunningPayroll(true);
      const companyId = BigInt(companyContractId);

      // Get active employees who have accepted
      const activeEmployees = employees
        .filter((emp) => emp.accepted && emp.active)
        .map((emp) => emp.wallet as `0x${string}`);

      if (activeEmployees.length === 0) {
        toast.error("No hay empleados activos para procesar la nómina");
        return;
      }

      const hash = await payrollManager.write.createPayrollRun(
        [companyId, activeEmployees],
        account
      );

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error running payroll:", error);
      toast.error("Error al procesar la nómina");
    } finally {
      setIsRunningPayroll(false);
    }
  };

  const handleAddEmployee = async () => {
    if (
      !(
        employeeRegistry &&
        account &&
        employeeForm.wallet &&
        employeeForm.amount &&
        employeeForm.frequencyDays &&
        employeeForm.lockPeriodDays
      )
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Validate wallet address
    if (!WALLET_ADDRESS_REGEX.test(employeeForm.wallet)) {
      toast.error("Dirección de wallet inválida");
      return;
    }

    try {
      setIsAddingEmployee(true);
      const companyId = BigInt(companyContractId);

      // Convert amount to USDT units (6 decimals)
      const decimals = (await mockUSDT?.read.decimals()) || BigInt(6);
      const amount = parseUnits(employeeForm.amount, Number(decimals));

      // Convert days to seconds
      const frequency = BigInt(
        Number(employeeForm.frequencyDays) * 24 * 60 * 60
      );
      const lockPeriod = BigInt(
        Number(employeeForm.lockPeriodDays) * 24 * 60 * 60
      );

      const hash = await employeeRegistry.write.addEmployee(
        [
          companyId,
          employeeForm.wallet as `0x${string}`,
          amount,
          frequency,
          lockPeriod,
        ],
        account
      );

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });

        // Generate invite link with employee address
        const inviteLink = `${window.location.origin}/accept-invitation?companyId=${companyContractId}&employee=${employeeForm.wallet}`;

        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(inviteLink);
          toast.success(
            "Empleado agregado exitosamente. Link de invitación copiado al portapapeles"
          );
        } catch {
          // Fallback: show link in toast
          toast.success(`Empleado agregado. Link: ${inviteLink}`, {
            duration: 10_000,
          });
        }

        setIsAddEmployeeOpen(false);
        setEmployeeForm({
          wallet: "",
          amount: "",
          frequencyDays: "",
          lockPeriodDays: "",
        });
        // Refresh data
        window.location.reload();
      }
    } catch (error: unknown) {
      console.error("Error adding employee:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error al agregar empleado";
      toast.error(errorMessage);
    } finally {
      setIsAddingEmployee(false);
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

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCopyInviteLink = async (employeeWallet: string) => {
    const inviteLink = `${window.location.origin}/accept-invitation?companyId=${companyContractId}&employee=${employeeWallet}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link de invitación copiado al portapapeles");
    } catch {
      toast.error("Error al copiar el link");
    }
  };

  if (loadingPage) {
    return <AnanaLoading />;
  }

  return (
    <div className="h-full w-full">
      <h1 className="mb-8 font-bold text-3xl text-[#2A190F] capitalize">
        {companyName || "Loading..."}
      </h1>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {totalEmployees}
            </div>
            <p className="text-[#2A190F]/60 text-xs">
              {employees.filter((e) => e.accepted).length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Monthly Payroll
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {formatAmount(BigInt(Math.floor(monthlyPayroll * 1_000_000)), 6)}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Total estimado mensual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {pendingApprovals}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Empleados pendientes</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Cost Savings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">12%</div>
            <p className="text-[#2A190F]/60 text-xs">vs traditional payroll</p>
          </CardContent>
        </Card> */}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A190F]">
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest payroll transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 3).map((payment) => (
                    <div
                      className="flex items-center justify-between"
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
                  ))}
                  {payments.length === 0 && (
                    <p className="text-[#2A190F]/60 text-sm">
                      No hay transacciones recientes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2A190F]">Quick Actions</CardTitle>
                <CardDescription>Common payroll tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                  disabled={
                    isRunningPayroll ||
                    employees.filter((e) => e.accepted && e.active).length === 0
                  }
                  onClick={handleRunPayroll}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isRunningPayroll ? "Processing..." : "Run Payroll"}
                </Button>
                <Button
                  className="w-full justify-start border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={() => setIsAddEmployeeOpen(true)}
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
                {employees.length === 0 ? (
                  <p className="text-[#2A190F]/60 text-sm">
                    No hay empleados registrados
                  </p>
                ) : (
                  employees.map((employee) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4 transition-colors hover:bg-[#2A190F]/5"
                      key={employee.wallet}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[#2A190F]">
                          {formatAddress(employee.wallet)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {employee.accepted ? (
                            <Badge className="bg-green-500/20 text-green-700 text-xs">
                              Accepted
                            </Badge>
                          ) : (
                            <>
                              <Badge className="bg-yellow-500/20 text-xs text-yellow-700">
                                Pending
                              </Badge>
                              <Button
                                className="h-6 border-[#2A190F]/20 bg-transparent px-2 text-xs hover:bg-[#2A190F]/5"
                                onClick={() =>
                                  handleCopyInviteLink(employee.wallet)
                                }
                                size="sm"
                                variant="outline"
                              >
                                <Copy className="mr-1 h-3 w-3" />
                                Copy Invite Link
                              </Button>
                            </>
                          )}
                          {!employee.active && (
                            <Badge className="bg-red-500/20 text-red-700 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">
                          {formatAmount(employee.amount)}
                        </p>
                        <p className="text-[#2A190F]/60 text-xs">per payment</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="payments">
          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-[#2A190F]">Payment History</CardTitle>
              <CardDescription>View all past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <p className="text-[#2A190F]/60 text-sm">
                    No hay pagos registrados
                  </p>
                ) : (
                  payments.map((payment) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4"
                      key={Number(payment.id)}
                    >
                      <div>
                        <p className="font-medium text-[#2A190F]">
                          Payment #{Number(payment.id)}
                        </p>
                        <p className="text-[#2A190F]/60 text-sm">
                          {formatAddress(payment.employee)} •{" "}
                          {formatDate(payment.releaseAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2A190F]">
                          {formatAmount(payment.amount)}
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
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Employee Dialog */}
      <Dialog onOpenChange={setIsAddEmployeeOpen} open={isAddEmployeeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#2A190F]">
              Agregar Nuevo Empleado
            </DialogTitle>
            <DialogDescription>
              Ingresa la información del empleado para agregarlo a la nómina
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="wallet">
                Dirección de Wallet
              </Label>
              <Input
                id="wallet"
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, wallet: e.target.value })
                }
                placeholder="0x..."
                value={employeeForm.wallet}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="amount">
                Monto por Pago (USD)
              </Label>
              <Input
                id="amount"
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, amount: e.target.value })
                }
                placeholder="1000.00"
                type="number"
                value={employeeForm.amount}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="frequency">
                Frecuencia de Pago (días)
              </Label>
              <Input
                id="frequency"
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    frequencyDays: e.target.value,
                  })
                }
                placeholder="30"
                type="number"
                value={employeeForm.frequencyDays}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="lockPeriod">
                Período de Bloqueo (días)
              </Label>
              <Input
                id="lockPeriod"
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    lockPeriodDays: e.target.value,
                  })
                }
                placeholder="10"
                type="number"
                value={employeeForm.lockPeriodDays}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
              onClick={() => setIsAddEmployeeOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              disabled={isAddingEmployee}
              onClick={handleAddEmployee}
            >
              {isAddingEmployee ? "Agregando..." : "Agregar Empleado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
