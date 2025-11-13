"use client";

import {
  Clock,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  Send,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import { useChainId, usePublicClient, useSwitchChain } from "wagmi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContracts } from "@/context/contracts-context";
import { useDownloadRoot } from "@/hooks/use-download-root";
import { useFileUpload } from "@/hooks/use-file-upload";

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

type EmployeeDocument = {
  employee: string;
  pieceCid: string;
  fileName: string;
  fileSize: bigint;
  uploader: string;
  uploadedAt: bigint;
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
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [companyName, setCompanyName] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isRunningPayroll, setIsRunningPayroll] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isInviteLinkModalOpen, setIsInviteLinkModalOpen] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState("");
  const [employeeForm, setEmployeeForm] = useState({
    wallet: "",
    amount: "",
    frequencyDays: "",
    lockPeriodDays: "",
  });
  const [vaultBalance, setVaultBalance] = useState<bigint>(BigInt(0));
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  // Documents
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadEmployeeWallet, setUploadEmployeeWallet] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const FILECOIN_CALIBRATION_CHAIN_ID = 314_159;
  const isOnFilecoin =
    chainId === FILECOIN_CALIBRATION_CHAIN_ID || chainId === 314;

  const handleSwitchToFilecoin = async () => {
    if (!switchChain) {
      toast.error("Switch chain function not available");
      return;
    }
    try {
      setIsSwitchingChain(true);
      await switchChain({ chainId: FILECOIN_CALIBRATION_CHAIN_ID });
      toast.success("Switched to Filecoin Calibration");
    } catch (error) {
      console.error("Error switching to Filecoin:", error);
      toast.error("Error switching to Filecoin Calibration");
    } finally {
      setIsSwitchingChain(false);
    }
  };
  const {
    uploadFileMutation,
    uploadedInfo,
    progress: uploadProgress,
    status: uploadStatus,
    handleReset: resetUploadState,
    isUploadComplete,
  } = useFileUpload();

  useEffect(() => {
    const SEPOLIA_CHAIN_ID = 11_155_111;
    // Solo hacer fetch cuando estamos en Sepolia (los contratos solo existen en Sepolia)
    if (chainId !== SEPOLIA_CHAIN_ID) {
      return;
    }

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

    const extractEmployeeAddresses = (events: unknown[]): Set<string> => {
      const addresses = new Set<string>();
      for (const event of events) {
        const eventWithArgs = event as { args?: { employee?: unknown } };
        if (eventWithArgs.args?.employee) {
          addresses.add(eventWithArgs.args.employee as string);
        }
      }
      return addresses;
    };

    const fetchEmployeeData = async (
      companyId: bigint,
      empAddress: string
    ): Promise<Employee | null> => {
      try {
        const employee = await employeeRegistry.read.getEmployee([
          companyId,
          empAddress as `0x${string}`,
        ]);

        if (employee.exists && employee.active) {
          return {
            wallet: empAddress,
            amount: employee.amount,
            frequency: employee.frequency,
            lockPeriod: employee.lockPeriod,
            accepted: employee.accepted,
            active: employee.active,
          };
        }
        return null;
      } catch (err) {
        console.warn("Error fetching employee:", err);
        return null;
      }
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

      const employeeAddresses = extractEmployeeAddresses(employeeAddedEvents);
      const employeePromises = Array.from(employeeAddresses).map((empAddress) =>
        fetchEmployeeData(companyId, empAddress)
      );
      const employeeResults = await Promise.all(employeePromises);

      return employeeResults.filter((emp): emp is Employee => emp !== null);
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

    const fetchCompanyDocuments = async (companyId: bigint) => {
      if (!employeeRegistry) {
        return [];
      }
      try {
        const docs = await employeeRegistry.read.getCompanyDocuments([
          companyId,
        ]);
        return docs as unknown as EmployeeDocument[];
      } catch (e) {
        console.warn("Error fetching company documents:", e);
        return [];
      }
    };

    const fetchVaultBalance = async (companyAdmin: string) => {
      if (!paymentVault) {
        return BigInt(0);
      }
      try {
        const balance = await paymentVault.read.getCompanyBalance([
          companyAdmin as `0x${string}`,
        ]);
        return balance;
      } catch (error) {
        console.error("Error fetching vault balance:", error);
        return BigInt(0);
      }
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

        const balance = await fetchVaultBalance(company.admin);
        setVaultBalance(balance);

        const docs = await fetchCompanyDocuments(companyId);
        setDocuments(docs);
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
    chainId,
  ]);

  const handleRunPayroll = async () => {
    if (
      !(
        payrollManager &&
        account &&
        employeeRegistry &&
        address &&
        paymentVault
      )
    ) {
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
        toast.error("No active employees to process payroll");
        return;
      }

      // Calculate total amount needed
      const totalAmount = activeEmployees.reduce((sum, empWallet) => {
        const emp = employees.find((e) => e.wallet === empWallet);
        return sum + (emp?.amount || BigInt(0));
      }, BigInt(0));

      // Check vault balance
      const balance = await paymentVault.read.getCompanyBalance([address]);
      if (balance < totalAmount) {
        toast.error(
          `Insufficient funds. Required: ${formatAmount(totalAmount)}, Available: ${formatAmount(balance)}`
        );
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
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error processing payroll";
      toast.error(errorMessage);
    } finally {
      setIsRunningPayroll(false);
    }
  };

  const handleDeposit = async () => {
    if (!(paymentVault && mockUSDT && account && address)) {
      toast.error("Cannot connect to contracts");
      return;
    }

    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsDepositing(true);
      const decimals = (await mockUSDT.read.decimals()) || BigInt(6);
      const amount = parseUnits(depositAmount, Number(decimals));

      // First, approve the vault to spend USDT
      toast.loading("Approving USDT...", { id: "approve" });
      const vaultAddress = paymentVault.address;
      const approveHash = await mockUSDT.write.approve(
        [vaultAddress, amount],
        account
      );

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        toast.success("USDT approved", { id: "approve" });

        // Then deposit
        toast.loading("Depositing funds...", { id: "deposit" });
        const depositHash = await paymentVault.write.deposit([amount], account);
        await publicClient.waitForTransactionReceipt({ hash: depositHash });
        toast.success("Funds deposited successfully!", { id: "deposit" });

        // Refresh balance
        const balance = await paymentVault.read.getCompanyBalance([address]);
        setVaultBalance(balance);
        setDepositAmount("");
        setIsDepositModalOpen(false);
      }
    } catch (error) {
      console.error("Error depositing funds:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error depositing funds";
      toast.error(errorMessage, { id: "deposit" });
      toast.error(errorMessage, { id: "approve" });
    } finally {
      setIsDepositing(false);
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
      toast.error("Please complete all fields");
      return;
    }

    // Validate wallet address
    if (!WALLET_ADDRESS_REGEX.test(employeeForm.wallet)) {
      toast.error("Invalid wallet address");
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

        // Store the invite link and show modal
        setGeneratedInviteLink(inviteLink);
        setIsAddEmployeeOpen(false);
        setEmployeeForm({
          wallet: "",
          amount: "",
          frequencyDays: "",
          lockPeriodDays: "",
        });
        setIsInviteLinkModalOpen(true);
      }
    } catch (error: unknown) {
      console.error("Error adding employee:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error adding employee";
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
      toast.success("Invitation link copied to clipboard");
    } catch {
      toast.error("Error copying link");
    }
  };

  const handleOpenUploadDialog = () => {
    setUploadEmployeeWallet("");
    setUploadFile(null);
    resetUploadState();
    setIsUploadModalOpen(true);
  };

  const handleUploadFile = async () => {
    if (!uploadFile) {
      toast.error("Select a file");
      return;
    }
    if (!uploadEmployeeWallet) {
      toast.error("Select employee");
      return;
    }
    try {
      await uploadFileMutation.mutateAsync({ file: uploadFile });
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error uploading document";
      toast.error(errorMessage);
    }
  };

  const handleAssignDocument = async () => {
    if (isAssigning) {
      return;
    }
    if (!employeeRegistry) {
      toast.error("Cannot connect to contracts");
      return;
    }
    if (!account) {
      toast.error("Cannot connect to wallet");
      return;
    }
    const SEPOLIA_CHAIN_ID = 11_155_111;

    if (!uploadedInfo?.pieceCid) {
      toast.error("No uploaded file found. Please upload a file first.");
      return;
    }
    if (!uploadFile) {
      toast.error("File information missing");
      return;
    }
    if (!uploadEmployeeWallet) {
      toast.error("Employee not selected");
      return;
    }

    setIsAssigning(true);
    try {
      // Switch to Sepolia if not already on it
      if (chainId !== SEPOLIA_CHAIN_ID) {
        if (!switchChain) {
          toast.error("Switch chain function not available");
          setIsAssigning(false);
          return;
        }
        toast.info("Switching to Sepolia to register document...");
        await switchChain({ chainId: SEPOLIA_CHAIN_ID });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Assign on-chain
      const companyId = BigInt(companyContractId);
      const hash = await employeeRegistry.write.addEmployeeDocument(
        [
          companyId,
          uploadEmployeeWallet as `0x${string}`,
          uploadedInfo.pieceCid,
          uploadFile.name,
          BigInt(uploadFile.size),
        ],
        account
      );
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success("Document registered on smart contract");
        // Refresh docs
        const docs = await employeeRegistry.read.getCompanyDocuments([
          companyId,
        ]);
        setDocuments(docs as unknown as EmployeeDocument[]);
        setIsUploadModalOpen(false);
        resetUploadState();
        setUploadFile(null);
        setUploadEmployeeWallet("");
      }
    } catch (error) {
      console.error("Assign error:", error);
      const errorMessage =
        (error as { shortMessage?: string; message?: string })?.shortMessage ||
        (error as { message?: string })?.message ||
        "Error registering document";
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const DocumentRow = ({ doc }: { doc: EmployeeDocument }) => {
    const { downloadMutation } = useDownloadRoot(doc.pieceCid, doc.fileName);
    const ext = doc.fileName.includes(".")
      ? doc.fileName.split(".").pop()
      : undefined;
    return (
      <div className="flex items-center justify-between rounded-lg border border-[#2A190F]/10 p-4">
        <div className="min-w-0">
          <p className="truncate font-medium text-[#2A190F]">
            {doc.fileName}
            {ext ? "" : ""}
          </p>
          <p className="text-[#2A190F]/60 text-xs">
            Owner: {formatAddress(doc.employee)} • CID:{" "}
            {doc.pieceCid.slice(0, 8)}...{doc.pieceCid.slice(-6)}
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
              toast.success("CID copied");
            }}
            size="sm"
            variant="outline"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
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
      <div className="mb-8 grid gap-4 md:grid-cols-4">
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
              {employees.filter((e) => e.accepted).length} active
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
            <p className="text-[#2A190F]/60 text-xs">Estimated monthly total</p>
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
            <p className="text-[#2A190F]/60 text-xs">Pending employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-[#2A190F] text-sm">
              Vault Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-[#2A190F]/60" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-[#2A190F]">
              {formatAmount(vaultBalance)}
            </div>
            <p className="text-[#2A190F]/60 text-xs">Available for payroll</p>
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
                      No recent transactions
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
                  onClick={() => setIsDepositModalOpen(true)}
                  variant="outline"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Deposit Funds
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
                    No employees registered
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
                    No payments registered
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

        <TabsContent className="space-y-4" value="documents">
          <Card className="border-[#2A190F]/20 bg-white/50 backdrop-blur">
            <CardHeader className="flex items-start justify-between sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-[#2A190F]">Documents</CardTitle>
                <CardDescription>All company documents</CardDescription>
              </div>
              <Button
                className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                onClick={handleOpenUploadDialog}
              >
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <p className="text-[#2A190F]/60 text-sm">No documents</p>
                ) : (
                  documents.map((d) => (
                    <DocumentRow doc={d} key={`${d.pieceCid}-${d.employee}`} />
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
              Add New Employee
            </DialogTitle>
            <DialogDescription>
              Enter employee information to add them to payroll
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="wallet">
                Wallet Address
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
                Amount per Payment (USD)
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
                Payment Frequency (days)
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
                Lock Period (days)
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
              Cancel
            </Button>
            <Button
              className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              disabled={isAddingEmployee}
              onClick={handleAddEmployee}
            >
              {isAddingEmployee ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog
        onOpenChange={(open) => {
          // Prevenir que se cierre automáticamente cuando está cambiando de red o subiendo
          if (!open && (isSwitchingChain || uploadFileMutation.isPending)) {
            return;
          }
          setIsUploadModalOpen(open);
        }}
        open={isUploadModalOpen}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-[#2A190F]">
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Select the employee and the file to upload
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!(isOnFilecoin || isUploadComplete) && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="mb-2 font-medium text-sm text-yellow-800">
                  ⚠️ Network switch required
                </p>
                <p className="mb-3 text-xs text-yellow-700">
                  To upload files to Filecoin, you need to switch to Filecoin
                  Calibration (Chain ID: 314159)
                </p>
                <Button
                  className="w-full bg-yellow-500 font-semibold text-white hover:bg-yellow-600"
                  disabled={isSwitchingChain}
                  onClick={handleSwitchToFilecoin}
                  size="sm"
                >
                  {isSwitchingChain
                    ? "Switching..."
                    : "Switch to Filecoin Calibration"}
                </Button>
              </div>
            )}
            {isOnFilecoin && !isUploadComplete && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-green-700 text-xs">
                  ✅ Connected to Filecoin Calibration. You can upload files.
                </p>
              </div>
            )}
            {isUploadComplete && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="mb-2 font-medium text-blue-800 text-sm">
                  ✅ Upload completed successfully
                </p>
                <p className="text-blue-700 text-xs">
                  File has been stored on Filecoin. Switch to Sepolia to
                  register the document on the smart contract.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[#2A190F]">Employee</Label>
              <Select
                onValueChange={(val) => setUploadEmployeeWallet(val)}
                value={uploadEmployeeWallet}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.wallet} value={e.wallet}>
                      {formatAddress(e.wallet)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#2A190F]">File</Label>
              <Input
                accept="*/*"
                onChange={(ev) => {
                  const f = ev.target.files?.[0] || null;
                  setUploadFile(f);
                }}
                type="file"
              />
              {uploadStatus && (
                <p className="text-[#2A190F]/60 text-xs">{uploadStatus}</p>
              )}
              {uploadFile && (
                <p className="text-[#2A190F]/60 text-xs">
                  {uploadFile.name} • {Math.ceil(uploadFile.size / 1024)} KB •{" "}
                  {uploadProgress}%
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            {isUploadComplete ? (
              <>
                <Button
                  className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={() => setIsUploadModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                  disabled={!(employeeRegistry && account) || isAssigning}
                  onClick={handleAssignDocument}
                >
                  {isAssigning ? "Assigning..." : "Assign to Employee"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={() => setIsUploadModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
                  disabled={
                    uploadFileMutation.isPending ||
                    !isOnFilecoin ||
                    !uploadFile ||
                    !uploadEmployeeWallet
                  }
                  onClick={handleUploadFile}
                >
                  {uploadFileMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Link Dialog */}
      <Dialog
        onOpenChange={setIsInviteLinkModalOpen}
        open={isInviteLinkModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#2A190F]">
              Employee Added Successfully
            </DialogTitle>
            <DialogDescription>
              Share this link with the employee to accept the invitation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#2A190F]">Invitation Link</Label>
              <div className="flex gap-2">
                <Input
                  className="font-mono text-xs"
                  readOnly
                  value={generatedInviteLink}
                />
                <Button
                  className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(generatedInviteLink);
                      toast.success("Link copied to clipboard");
                    } catch {
                      toast.error("Error copying link");
                    }
                  }}
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              onClick={() => {
                setIsInviteLinkModalOpen(false);
                window.location.reload();
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Funds Dialog */}
      <Dialog onOpenChange={setIsDepositModalOpen} open={isDepositModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#2A190F]">Deposit Funds</DialogTitle>
            <DialogDescription>
              Add USDT to your vault balance for payroll payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#2A190F]" htmlFor="depositAmount">
                Amount (USD)
              </Label>
              <Input
                id="depositAmount"
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="1000.00"
                type="number"
                value={depositAmount}
              />
            </div>
            <div className="rounded-lg bg-[#2A190F]/5 p-3">
              <p className="text-[#2A190F]/60 text-sm">Current Vault Balance</p>
              <p className="font-semibold text-[#2A190F] text-lg">
                {formatAmount(vaultBalance)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="border-[#2A190F]/20 bg-transparent hover:bg-[#2A190F]/5"
              onClick={() => setIsDepositModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FCBA2E] font-semibold text-[#2A190F] shadow-[0_4px_0_0_#DD840E] hover:bg-[#F1C644]"
              disabled={isDepositing}
              onClick={handleDeposit}
            >
              {isDepositing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
