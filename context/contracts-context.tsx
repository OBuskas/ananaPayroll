"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  type Abi,
  type Address,
  type GetContractReturnType,
  getContract,
  type PublicClient,
  type WalletClient,
  type decodeEventLog,
} from "viem";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";


// ABIs
import CompanyRegistryAbiJson from "../hardhat/abi/CompanyRegistry.json";
import MockUSDTAbiJson from "../hardhat/abi/MockUSDT.json";
import PaymentVaultAbiJson from "../hardhat/abi/PaymentVault.json";
import PayrollManagerAbiJson from "../hardhat/abi/PayrollManager.json";

// Deployed addresses
import contracts from "../hardhat/deployed.json";

const CompanyRegistry = contracts.CompanyRegistry as Address;
const PaymentVault = contracts.PaymentVault as Address;
const MockUSDT = contracts.MockUSDT as Address;
const PayrollManager = contracts.PayrollManager as Address;

// Convert JSON ABIs to viem Abi
const CompanyRegistryAbi = CompanyRegistryAbiJson.abi as unknown as Abi;
const PaymentVaultAbi = PaymentVaultAbiJson.abi as unknown as Abi;
const MockUSDTAbi = MockUSDTAbiJson.abi as unknown as Abi;
const PayrollManagerAbi = PayrollManagerAbiJson.abi as unknown as Abi;

type ContractType<TAbi extends Abi> = GetContractReturnType<TAbi, PublicClient | WalletClient>;

type ContractsContextType = {
  // Contracts
  companyRegistryRead?: ContractType<typeof CompanyRegistryAbi>;
  companyRegistryWrite?: ContractType<typeof CompanyRegistryAbi>;
  paymentVaultRead?: ContractType<typeof PaymentVaultAbi>;
  paymentVaultWrite?: ContractType<typeof PaymentVaultAbi>;
  mockUSDTRead?: ContractType<typeof MockUSDTAbi>;
  mockUSDTWrite?: ContractType<typeof MockUSDTAbi>;
  payrollManagerRead?: ContractType<typeof PayrollManagerAbi>;
  payrollManagerWrite?: ContractType<typeof PayrollManagerAbi>;

  // Extra
  organizationName?: string;
  companyId?: bigint;
};

const ContractsContext = createContext<ContractsContextType>({});

export const useContracts = () => useContext(ContractsContext);

const instantiateContract = <TAbi extends Abi>(
  address: Address,
  abi: TAbi,
  publicClient?: PublicClient,
  walletClient?: WalletClient
): { read?: ContractType<TAbi>; write?: ContractType<TAbi> } => {
  const read = publicClient
    ? getContract({ address, abi, publicClient }) as ContractType<TAbi>
    : undefined;
  const write = walletClient
    ? getContract({ address, abi, walletClient }) as ContractType<TAbi>
    : undefined;

  return { read, write };
};

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [companyRegistryRead, setCompanyRegistryRead] = useState<ContractType<typeof CompanyRegistryAbi>>();
  const [companyRegistryWrite, setCompanyRegistryWrite] = useState<ContractType<typeof CompanyRegistryAbi>>();
  const [paymentVaultRead, setPaymentVaultRead] = useState<ContractType<typeof PaymentVaultAbi>>();
  const [paymentVaultWrite, setPaymentVaultWrite] = useState<ContractType<typeof PaymentVaultAbi>>();
  const [mockUSDTRead, setMockUSDTRead] = useState<ContractType<typeof MockUSDTAbi>>();
  const [mockUSDTWrite, setMockUSDTWrite] = useState<ContractType<typeof MockUSDTAbi>>();
  const [payrollManagerRead, setPayrollManagerRead] = useState<ContractType<typeof PayrollManagerAbi>>();
  const [payrollManagerWrite, setPayrollManagerWrite] = useState<ContractType<typeof PayrollManagerAbi>>();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [companyId, setCompanyId] = useState<bigint | undefined>(undefined);

  const publicClient = usePublicClient();
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const cr = instantiateContract(CompanyRegistry, CompanyRegistryAbi, publicClient, walletClient);
    setCompanyRegistryRead(cr.read);
    setCompanyRegistryWrite(cr.write);

    const pv = instantiateContract(PaymentVault, PaymentVaultAbi, publicClient, walletClient);
    setPaymentVaultRead(pv.read);
    setPaymentVaultWrite(pv.write);

    const usdt = instantiateContract(MockUSDT, MockUSDTAbi, publicClient, walletClient);
    setMockUSDTRead(usdt.read);
    setMockUSDTWrite(usdt.write);

    const pm = instantiateContract(PayrollManager, PayrollManagerAbi, publicClient, walletClient);
    setPayrollManagerRead(pm.read);
    setPayrollManagerWrite(pm.write);
  }, [publicClient, walletClient]);

  const getCompany = async (id: bigint) => {
    if (!companyRegistryRead) return null;
    try {
      return await companyRegistryRead.readContract({
        functionName: "getCompany",
        args: [id],
      });
    } catch {
      return null;
    }
  };

 
  const createCompany = async (name: string) => {
    if (!walletClient || !publicClient) {
      console.warn("Wallet no conectada aún");
      return;
  }

  const hash = await walletClient.writeContract({
    address: CompanyRegistry,
    abi: CompanyRegistryAbi,
    functionName: "registerCompany",
    args: [name],
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return hash;
};

const getUserCompanies = async (userAddress: string) => {
  if (!publicClient) return [];
  const companies: any[] = [];

  let totalCompanies: bigint;
  try {
    totalCompanies = await publicClient.readContract({
      address: CompanyRegistry,
      abi: CompanyRegistryAbi,
      functionName: "nextCompanyId",
    });
  } catch (err) {
    console.warn("Error fetching nextCompanyId:", err);
    return [];
  }

  for (let i = 0n; i < totalCompanies; i++) {
    try {
      const company = await publicClient.readContract({
        address: CompanyRegistry,
        abi: CompanyRegistryAbi,
        functionName: "getCompany",
        args: [i],
      });

      const isAdmin = await publicClient.readContract({
        address: CompanyRegistry,
        abi: CompanyRegistryAbi,
        functionName: "isCompanyAdmin",
        args: [i, userAddress],
      });

      if (isAdmin) companies.push({ id: i, ...company });
    } catch {
      continue;
    }
  }

  return companies;
};

useEffect(() => {
  const fetchCompany = async () => {
    if (!publicClient || companyId === undefined) return;
    const company = await getCompany(companyId);
    setOrganizationName(company?.name || "");
  };
  fetchCompany();
}, [publicClient, companyId]);

  return (
    <ContractsContext.Provider
      value={{
        companyRegistryRead,
        companyRegistryWrite,
        paymentVaultRead,
        paymentVaultWrite,
        mockUSDTRead,
        mockUSDTWrite,
        payrollManagerRead,
        payrollManagerWrite,
        organizationName,
        companyId,
        createCompany,
        isConnected,
        walletClient,
        address,
        getUserCompanies,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
}
