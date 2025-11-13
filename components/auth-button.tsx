"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { LogOut, Network, UserCircleIcon, Wallet } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export default function AuthButton() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  const {
    connect,
    isConnected,
    loading: connectLoading,
  } = useWeb3AuthConnect();

  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { address, connector } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isLoading = connectLoading || disconnectLoading;
  const isDevMode = process.env.NODE_ENV === "development";

  const FILECOIN_CALIBRATION_CHAIN_ID = 314_159;
  const SEPOLIA_CHAIN_ID = 11_155_111;

  const formatAddress = (addr: string | undefined) => {
    if (!addr) {
      return "N/A";
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (id: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      8453: "Base",
      11155111: "Sepolia",
      80002: "Polygon Amoy",
      314159: "Filecoin Calibration",
      314: "Filecoin Mainnet",
    };
    return chains[id] || `Chain ${id}`;
  };

  const handleSwitchChain = async (targetChainId: number) => {
    if (!switchChain) {
      toast.error("Switch chain function not available");
      return;
    }
    try {
      await switchChain({ chainId: targetChainId });
      toast.success(`Cambiado a ${getChainName(targetChainId)}`);
    } catch (error) {
      console.error("Error switching chain:", error);
      toast.error("Error al cambiar de red");
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isLoading || !mounted) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!isConnected) {
    return (
      <Button disabled={isLoading} onClick={() => connect()}>
        Login
      </Button>
    );
  }

  const shouldRedirectToDashboard = pathname === "/";
  if (shouldRedirectToDashboard) {
    redirect("/dashboard");
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserCircleIcon className="size-8 cursor-pointer stroke-1.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Network className="mr-2 h-4 w-4" />
          <span>Network: {getChainName(chainId)}</span>
        </DropdownMenuItem>
        {isDevMode && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch Network (Dev)</DropdownMenuLabel>
            {chainId !== SEPOLIA_CHAIN_ID && (
              <DropdownMenuItem
                onClick={() => handleSwitchChain(SEPOLIA_CHAIN_ID)}
              >
                <Network className="mr-2 h-4 w-4" />
                <span>Switch to Sepolia</span>
              </DropdownMenuItem>
            )}
            {chainId !== FILECOIN_CALIBRATION_CHAIN_ID && (
              <DropdownMenuItem
                onClick={() => handleSwitchChain(FILECOIN_CALIBRATION_CHAIN_ID)}
              >
                <Network className="mr-2 h-4 w-4" />
                <span>Switch to Filecoin Calibration</span>
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuItem disabled>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Wallet: {connector?.name || "N/A"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyAddress}>
          <span className="text-muted-foreground text-xs">
            {copied ? "Copied!" : formatAddress(address)}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
