"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type Abi,
  type Address,
  type Chain,
  type GetContractReturnType,
  getContract,
  type PublicClient,
  type WalletClient,
} from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CompanyRegistryAbi } from "@/hardhat/abi/CompanyRegistry.abi";
import { EmployeeRegistryAbi } from "@/hardhat/abi/EmployeeRegistry.abi";
import { MockUSDTAbi } from "@/hardhat/abi/MockUSDT.abi";
import { PaymentVaultAbi } from "@/hardhat/abi/PaymentVault.abi";
import { PayrollManagerAbi } from "@/hardhat/abi/PayrollManager.abi";
import contracts from "../hardhat/deployed.json";

const CompanyRegistry = contracts.CompanyRegistry as Address;
const EmployeeRegistry = contracts.EmployeeRegistry as Address;
const PaymentVault = contracts.PaymentVault as Address;
const MockUSDT = contracts.MockUSDT as Address;
const PayrollManager = contracts.PayrollManager as Address;

type ContractType<TAbi extends Abi> = GetContractReturnType<
  TAbi,
  PublicClient | WalletClient
>;

type ContractsContextType = {
  address?: Address;
  isConnected?: boolean;
  account?: { account: Address; chain: Chain };
  companyRegistry?: ContractType<typeof CompanyRegistryAbi>;
  employeeRegistry?: ContractType<typeof EmployeeRegistryAbi>;
  paymentVault?: ContractType<typeof PaymentVaultAbi>;
  mockUSDT?: ContractType<typeof MockUSDTAbi>;
  payrollManager?: ContractType<typeof PayrollManagerAbi>;
};

const ContractsContext = createContext<ContractsContextType>({});

export const useContracts = () => useContext(ContractsContext);

const instantiateContract = <TAbi extends Abi>(
  contractAddress: Address,
  contractAbi: TAbi,
  publicClient: PublicClient,
  walletClient: WalletClient
): GetContractReturnType<TAbi, PublicClient | WalletClient> =>
  getContract({
    address: contractAddress,
    abi: contractAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  }) as GetContractReturnType<TAbi, PublicClient | WalletClient>;

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [companyRegistry, setCompanyRegistry] = useState<
    ContractType<typeof CompanyRegistryAbi> | undefined
  >(undefined);
  const [employeeRegistry, setEmployeeRegistry] = useState<
    ContractType<typeof EmployeeRegistryAbi> | undefined
  >(undefined);
  const [paymentVault, setPaymentVault] = useState<
    ContractType<typeof PaymentVaultAbi> | undefined
  >(undefined);
  const [mockUSDT, setMockUSDT] = useState<
    ContractType<typeof MockUSDTAbi> | undefined
  >(undefined);
  const [payrollManager, setPayrollManager] = useState<
    ContractType<typeof PayrollManagerAbi> | undefined
  >(undefined);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, chain } = useAccount();
  const account = address && chain ? { account: address, chain } : undefined;

  useEffect(() => {
    if (!(publicClient && walletClient)) {
      return;
    }

    setCompanyRegistry(
      instantiateContract(
        CompanyRegistry,
        CompanyRegistryAbi,
        publicClient,
        walletClient
      )
    );
    setEmployeeRegistry(
      instantiateContract(
        EmployeeRegistry,
        EmployeeRegistryAbi,
        publicClient,
        walletClient
      )
    );
    setPaymentVault(
      instantiateContract(
        PaymentVault,
        PaymentVaultAbi,
        publicClient,
        walletClient
      )
    );
    setMockUSDT(
      instantiateContract(MockUSDT, MockUSDTAbi, publicClient, walletClient)
    );
    setPayrollManager(
      instantiateContract(
        PayrollManager,
        PayrollManagerAbi,
        publicClient,
        walletClient
      )
    );
  }, [publicClient, walletClient]);

  return (
    <ContractsContext.Provider
      value={{
        companyRegistry,
        employeeRegistry,
        paymentVault,
        mockUSDT,
        payrollManager,
        address,
        isConnected,
        account,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
}
