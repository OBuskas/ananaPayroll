"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { LogOut, Network, UserCircleIcon, Wallet } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
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

  const isLoading = connectLoading || disconnectLoading;

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
    };
    return chains[id] || `Chain ${id}`;
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
        <DropdownMenuItem disabled>
          <Wallet className="mr-2 h-4 w-4" />
          <span>Wallet: {connector?.name || "N/A"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span className="text-muted-foreground text-xs">
            {formatAddress(address)}
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
