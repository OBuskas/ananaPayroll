import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import {
  type Web3AuthContextConfig,
  Web3AuthProvider,
} from "@web3auth/modal/react";

const web3AuthOptions: Web3AuthOptions = {
  clientId: "YOUR_WEB3AUTH_CLIENT_ID", // Pass your Web3Auth Client ID, ideally using an environment variable // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // or WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
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
      {children}
    </Web3AuthProvider>
  );
}
