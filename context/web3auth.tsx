"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import {
  type Web3AuthContextConfig,
  Web3AuthProvider,
} from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { ContractsProvider } from "./contracts-context";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const queryClient = new QueryClient();

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  defaultChainId: "0xaa36a7",
  ssr: true,
};

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
};

export default function Web3AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <ContractsProvider>{children}</ContractsProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
