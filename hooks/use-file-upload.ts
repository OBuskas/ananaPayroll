import { Synapse } from "@filoz/synapse-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useConfig } from "@/context/providers";
import { useEthersSigner } from "@/hooks/use-ethers";
import { usePayment } from "@/hooks/use-payment";
import { calculateStorageMetrics } from "@/lib/utils";

export type UploadedInfo = {
  fileName?: string;
  fileSize?: number;
  pieceCid?: string;
  txHash?: string;
};

const FILECOIN_CALIBRATION_CHAIN_ID = 314_159;
const SEPOLIA_CHAIN_ID = 11_155_111;

const isFilecoinNetwork = (chainId: number | undefined): boolean =>
  chainId === FILECOIN_CALIBRATION_CHAIN_ID || chainId === 314;

type UploadParams = {
  file: File;
  activeSigner: ReturnType<typeof useEthersSigner>;
  config: ReturnType<typeof useConfig>["config"];
  datasetId: string | undefined;
  withCDN: boolean | undefined;
  paymentMutation: ReturnType<typeof usePayment>["mutation"];
  setStatus: (status: string) => void;
  setProgress: (progress: number) => void;
  setUploadedInfo: React.Dispatch<React.SetStateAction<UploadedInfo | null>>;
};

const uploadFileToFilecoin = async (params: UploadParams): Promise<string> => {
  const {
    file,
    activeSigner,
    config,
    datasetId,
    withCDN,
    paymentMutation,
    setStatus,
    setProgress,
    setUploadedInfo,
  } = params;
  if (!activeSigner) {
    throw new Error("Signer not available for Filecoin network");
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8ArrayBytes = new Uint8Array(arrayBuffer);
  const synapse = await Synapse.create({ signer: activeSigner, withCDN });

  setStatus(
    "💰 Checking if you have enough USDFC to cover the storage costs..."
  );
  setProgress(5);
  const { isSufficient, depositNeeded } = await calculateStorageMetrics(
    synapse,
    config,
    file.size
  );

  if (!isSufficient) {
    setStatus(
      "💰 Insufficient storage balance, setting up your storage configuration..."
    );
    await paymentMutation.mutateAsync({ depositAmount: depositNeeded });
    setStatus("💰 Storage configuration setup complete");
  }

  setStatus("🔗 Setting up storage service and dataset...");
  setProgress(25);
  const storageService = await synapse.storage.createContext({
    dataSetId: datasetId ? Number.parseInt(datasetId, 10) : undefined,
    callbacks: {
      onDataSetResolved: (info) => {
        console.log("Dataset resolved:", info);
        setStatus("🔗 Existing dataset found and resolved");
        setProgress(30);
      },
      onProviderSelected: (provider) => {
        console.log("Storage provider selected:", provider);
        setStatus("🏪 Storage provider selected");
      },
    },
  });

  setStatus("📁 Uploading file to storage provider...");
  setProgress(55);
  const { pieceCid } = await storageService.upload(uint8ArrayBytes, {
    metadata: { fileName: file.name, fileSize: file.size.toString() },
    onUploadComplete: (piece) => {
      setStatus("📊 File uploaded! Signing msg to add pieces to the dataset");
      setUploadedInfo((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        pieceCid: piece.toV1().toString(),
      }));
      setProgress(80);
    },
    onPieceAdded: (hash) => {
      setStatus(
        `🔄 Waiting for transaction to be confirmed on chain (txHash: ${hash})`
      );
      setUploadedInfo((prev) => ({ ...prev, txHash: hash }));
    },
    onPieceConfirmed: () => {
      setStatus("🌳 Data pieces added to dataset successfully");
      setProgress(90);
    },
  });

  setProgress(95);
  setUploadedInfo((prev) => ({
    ...prev,
    fileName: file.name,
    fileSize: file.size,
    pieceCid: pieceCid.toV1().toString(),
  }));

  return pieceCid.toV1().toString();
};

export const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedInfo, setUploadedInfo] = useState<UploadedInfo | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const { address, chainId } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const signer = useEthersSigner();
  const filecoinSigner = useEthersSigner({
    chainId: FILECOIN_CALIBRATION_CHAIN_ID,
  });
  const { config } = useConfig();
  const { mutation: paymentMutation } = usePayment(true);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["upload", address, chainId],
    mutationFn: async ({
      file,
      datasetId,
      withCDN,
    }: {
      file: File;
      datasetId?: string;
      withCDN?: boolean;
    }): Promise<string> => {
      if (!signer) {
        throw new Error("Signer not found");
      }
      if (!address) {
        throw new Error("Address not found");
      }

      const currentChain = currentChainId || chainId;
      if (!isFilecoinNetwork(currentChain)) {
        throw new Error(
          "Por favor, cambia a Filecoin Calibration (Chain ID: 314159) antes de subir el archivo"
        );
      }

      setProgress(0);
      setUploadedInfo(null);
      setIsUploadComplete(false);

      setStatus("🔄 Initializing file upload to Filecoin...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const activeSigner = filecoinSigner || signer;

      const pieceCid = await uploadFileToFilecoin({
        file,
        activeSigner,
        config,
        datasetId,
        withCDN,
        paymentMutation,
        setStatus,
        setProgress,
        setUploadedInfo,
      });

      return pieceCid;
    },
    onSuccess: () => {
      setStatus("🎉 File successfully stored on Filecoin!");
      setProgress(100);
      setIsUploadComplete(true);
      toast.success("File successfully stored on Filecoin!");
      queryClient.invalidateQueries({
        queryKey: ["balances", address, config, chainId],
      });
      queryClient.invalidateQueries({
        queryKey: ["datasets", address, chainId],
      });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setStatus(`❌ Upload failed: ${error.message || "Please try again"}`);
      setProgress(0);
      setIsUploadComplete(false);
    },
  });

  /** Cambia de vuelta a Sepolia */
  const switchBackToSepolia = async () => {
    if (!switchChain) {
      toast.error("Switch chain function not available");
      return;
    }
    try {
      setStatus("🔄 Cambiando a Sepolia...");
      await switchChain({ chainId: SEPOLIA_CHAIN_ID });
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Cambiado a Sepolia");
      setIsUploadComplete(false);
      handleReset();
    } catch (error) {
      console.error("Error switching to Sepolia:", error);
      toast.error("Error al cambiar a Sepolia");
    }
  };

  /** Resets upload state for new upload */
  const handleReset = () => {
    setProgress(0);
    setUploadedInfo(null);
    setStatus("");
    setIsUploadComplete(false);
  };

  return {
    uploadFileMutation: mutation,
    progress,
    uploadedInfo,
    handleReset,
    status,
    isUploadComplete,
    switchBackToSepolia,
  };
};
