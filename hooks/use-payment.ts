import { Synapse, TIME_CONSTANTS, TOKENS } from "@filoz/synapse-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useConfig } from "@/context/providers";
import { MAX_UINT256 } from "@/lib/constants";
import { useEthersSigner } from "./use-ethers";

/**
 * Custom hook for handling storage payment transactions using EIP-2612 permit signatures
 */
export const usePayment = (ignoreConfetti = false) => {
  const [status, setStatus] = useState<string>("");
  const { address, chainId } = useAccount();
  const signer = useEthersSigner();
  const { config } = useConfig();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["payment", address, chainId],
    mutationFn: async ({ depositAmount }: { depositAmount: bigint }) => {
      // === VALIDATION PHASE ===
      // Ensure all required dependencies are available before proceeding
      if (!address) {
        throw new Error("Address not found");
      }
      if (!signer) {
        throw new Error("Signer not found");
      }
      if (!chainId) {
        throw new Error("Chain id not found");
      }

      // === SYNAPSE INITIALIZATION ===
      // Create Synapse instance with user's configuration
      const synapse = await Synapse.create({
        signer,
        withCDN: config.withCDN,
      });

      // Get contract addresses from Synapse for the current network
      const warmStorageAddress = synapse.getWarmStorageAddress();

      // === BALANCE VALIDATION ===
      // Check if user has sufficient USDFC tokens for the deposit
      const amount = depositAmount;

      console.log("amount", amount);
      const balance = await synapse.payments.walletBalance(TOKENS.USDFC);

      if (balance < amount) {
        throw new Error("Insufficient tUSDFC balance");
      }

      setStatus("💰 Setting up your storage configuration...");

      if (amount > BigInt(0)) {
        const tx = await synapse.payments.depositWithPermitAndApproveOperator(
          amount,
          warmStorageAddress,
          MAX_UINT256,
          MAX_UINT256,
          TIME_CONSTANTS.EPOCHS_PER_MONTH
        );
        await tx.wait(1);
      } else {
        const tx = await synapse.payments.approveService(
          warmStorageAddress,
          MAX_UINT256,
          MAX_UINT256,
          TIME_CONSTANTS.EPOCHS_PER_MONTH
        );
        await tx.wait(1);
      }
      setStatus("💰 You successfully configured your storage");
      return;
    },
    onSuccess: () => {
      setStatus("✅ Payment was successful!");
      if (!ignoreConfetti) {
        toast.success("Payment was successful!");
      }
      queryClient.invalidateQueries({
        queryKey: ["balances", address, config, chainId],
      });
    },
    onError: (error) => {
      console.error("Payment failed:", error);
      setStatus(
        `❌ ${error.message || "Transaction failed. Please try again."}`
      );
    },
  });
  return { mutation, status };
};
