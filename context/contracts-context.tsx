"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type Abi,
  type Address,
  type GetContractReturnType,
  getContract,
  type PublicClient,
  type WalletClient,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import CompanyRegistryAbiJson from "../hardhat/abi/CompanyRegistry.json";
import MockUSDTAbiJson from "../hardhat/abi/MockUSDT.json";
import PaymentVaultAbiJson from "../hardhat/abi/PaymentVault.json";
import PayrollManagerAbiJson from "../hardhat/abi/PayrollManager.json";
import contracts from "../hardhat/deployed.json";

const CompanyRegistry = contracts.CompanyRegistry as Address;
const PaymentVault = contracts.PaymentVault as Address;
const MockUSDT = contracts.MockUSDT as Address;
const PayrollManager = contracts.PayrollManager as Address;

// Convertimos los ABIs JSON a tipos Abi de viem
const CompanyRegistryAbi = CompanyRegistryAbiJson.abi as unknown as Abi;
const PaymentVaultAbi = PaymentVaultAbiJson.abi as unknown as Abi;
const MockUSDTAbi = MockUSDTAbiJson.abi as unknown as Abi;
const PayrollManagerAbi = PayrollManagerAbiJson.abi as unknown as Abi;

type ContractType<TAbi extends Abi> = GetContractReturnType<
  TAbi,
  PublicClient | WalletClient
>;

type ContractsContextType = {
  companyRegistry?: ContractType<typeof CompanyRegistryAbi>;
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
): ContractType<TAbi> =>
  getContract({
    address: contractAddress,
    abi: contractAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  }) as ContractType<TAbi>;

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [companyRegistry, setCompanyRegistry] = useState<
    ContractType<typeof CompanyRegistryAbi> | undefined
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
  const walletClient = useWalletClient();

  useEffect(() => {
    if (!(publicClient && walletClient?.data)) {
      return;
    }

    const compRegistry = instantiateContract(
      CompanyRegistry,
      CompanyRegistryAbi,
      publicClient,
      walletClient.data
    );

    console.log({
      compRegistry,
    });

    setCompanyRegistry(
      instantiateContract(
        CompanyRegistry,
        CompanyRegistryAbi,
        publicClient,
        walletClient.data
      )
    );
    setPaymentVault(
      instantiateContract(
        PaymentVault,
        PaymentVaultAbi,
        publicClient,
        walletClient.data
      )
    );
    setMockUSDT(
      instantiateContract(
        MockUSDT,
        MockUSDTAbi,
        publicClient,
        walletClient.data
      )
    );
    setPayrollManager(
      instantiateContract(
        PayrollManager,
        PayrollManagerAbi,
        publicClient,
        walletClient.data
      )
    );
  }, [publicClient, walletClient]);

  return (
    <ContractsContext.Provider
      value={{ companyRegistry, paymentVault, mockUSDT, payrollManager }}
    >
      {children}
    </ContractsContext.Provider>
  );
}
