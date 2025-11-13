import { Synapse } from "@filoz/synapse-sdk";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConfig } from "@/context/providers";
import { useEthersSigner } from "@/hooks/use-ethers";

export const useDownloadRoot = (pieceCid: string, fileName: string) => {
  const { config } = useConfig();
  const signer = useEthersSigner();

  const downloadMutation = useMutation({
    mutationKey: ["download", pieceCid, fileName],
    mutationFn: async () => {
      if (!pieceCid) {
        throw new Error("Missing pieceCid");
      }
      const synapse = await Synapse.create({
        signer,
        withCDN: config.withCDN,
      });

      const storageService = await synapse.storage.createContext({});
      const { bytes } = await storageService.download(pieceCid);

      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { message?: string })?.message || "Error downloading file";
      toast.error(msg);
    },
  });

  return { downloadMutation };
};
