"use client";

import type { DataSetData, EnhancedDataSetInfo } from "@filoz/synapse-sdk";
import { createContext, useContext, useEffect, useState } from "react";

export type UnifiedSizeInfo = {
  /** Size in bytes - primary measurement */
  sizeBytes: bigint;
  /** Size in KiB (1024 bytes) */
  sizeKiB: number;
  /** Size in MiB (1024^2 bytes) */
  sizeMiB: number;
  /** Size in GiB (1024^3 bytes) - standardized for calculations */
  sizeGiB: number;
  /** Whether CDN storage is enabled for this item */
  withCDN?: boolean;
  /** Number of merkle tree leaves */
  leafCount?: number;
  /** Number of pieces */
  pieceCount?: number;
  /** User-friendly size message */
  message?: string;
};

/**
 * Dataset-specific size information
 * Uses standardized UnifiedSizeInfo with required dataset fields
 */

export type DatasetsSizeInfo = {
  sizeInBytes: number;
  sizeInKiB: number;
  sizeInMiB: number;
  sizeInGB: number;
};

export interface DataSet extends EnhancedDataSetInfo, DatasetsSizeInfo {
  serviceURL: string;
  data: DataSetData | null;
  pieceSizes: Record<string, UnifiedSizeInfo>;
}

export type DatasetsResponse = {
  datasets: DataSet[];
};

/**
 * Interface for formatted balance data returned by useBalances
 */
export interface UseBalancesResponse extends StorageCalculationResult {
  filBalance: bigint;
  usdfcBalance: bigint;
  warmStorageBalance: bigint;
  filBalanceFormatted: number;
  usdfcBalanceFormatted: number;
  warmStorageBalanceFormatted: number;
  availableToFreeUpFormatted: number;
  monthlyRateFormatted: number;
  maxMonthlyRateFormatted: number;
}

export const defaultBalances: UseBalancesResponse = {
  availableToFreeUp: BigInt(0),
  filBalance: BigInt(0),
  usdfcBalance: BigInt(0),
  warmStorageBalance: BigInt(0),
  filBalanceFormatted: 0,
  usdfcBalanceFormatted: 0,
  warmStorageBalanceFormatted: 0,
  availableToFreeUpFormatted: 0,
  daysLeft: 0,
  daysLeftAtCurrentRate: 0,
  isSufficient: false,
  isRateSufficient: false,
  isLockupSufficient: false,
  depositNeeded: BigInt(0),
  totalConfiguredCapacity: 0,
  monthlyRateFormatted: 0,
  maxMonthlyRateFormatted: 0,
};
/**
 * Interface representing the Pandora balance data returned from the SDK
 */
export type WarmStorageBalance = {
  rateAllowanceNeeded: bigint;
  lockupAllowanceNeeded: bigint;
  currentRateAllowance: bigint;
  currentLockupAllowance: bigint;
  currentRateUsed: bigint;
  currentLockupUsed: bigint;
  sufficient: boolean;
  message?: string;
  costs: {
    perEpoch: bigint;
    perDay: bigint;
    perMonth: bigint;
  };
  depositAmountNeeded: bigint;
};

/**
 * Interface representing the calculated storage metrics
 */
export type StorageCalculationResult = {
  /** Balance needed to cover storage */
  depositNeeded: bigint;
  /** The available balance to free up */
  availableToFreeUp: bigint;
  /** Number of days left before lockup expires at configured storage capacity(GB) rate */
  daysLeft: number;
  /** Number of days left before lockup expires at current rate */
  daysLeftAtCurrentRate: number;
  /** Whether the rate allowance and lockup allowance are sufficient based on your configuration */
  isSufficient: boolean;
  /** Whether the rate allowance is sufficient based on your configuration */
  isRateSufficient: boolean;
  /** Whether the lockup allowance is sufficient based on your configuration */
  isLockupSufficient: boolean;
  /** The total storage paid for in GB */
  totalConfiguredCapacity: number;
};

export type StorageCosts = {
  pricePerTiBPerMonthNoCDN: bigint;
  pricePerTiBPerMonthWithCDN: bigint;
};

export type ConfigType = {
  storageCapacity: number;
  persistencePeriod: number;
  minDaysThreshold: number;
  withCDN: boolean;
};

export type ConfigContextType = {
  config: ConfigType;
  updateConfig: (newConfig: Partial<ConfigType>) => void;
  resetConfig: () => void;
};
const defaultConfig = {
  // The number of GB of storage capacity needed to be sufficient
  storageCapacity: 150,
  // The number of days of lockup needed to be sufficient
  persistencePeriod: 365,
  // The minimum number of days of lockup needed to be sufficient
  minDaysThreshold: 50,
  // Whether to use CDN for the storage for faster retrieval
  withCDN: true,
} satisfies {
  storageCapacity: number;
  persistencePeriod: number;
  minDaysThreshold: number;
  withCDN: boolean;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = "app-config";

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<ConfigType>(defaultConfig);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Validate that all required keys exist and have correct types
        const validatedConfig = {
          storageCapacity:
            typeof parsedConfig.storageCapacity === "number"
              ? parsedConfig.storageCapacity
              : defaultConfig.storageCapacity,
          persistencePeriod:
            typeof parsedConfig.persistencePeriod === "number"
              ? parsedConfig.persistencePeriod
              : defaultConfig.persistencePeriod,
          minDaysThreshold:
            typeof parsedConfig.minDaysThreshold === "number"
              ? parsedConfig.minDaysThreshold
              : defaultConfig.minDaysThreshold,
          withCDN: true,
          /* typeof parsedConfig.withCDN === "boolean"
              ? parsedConfig.withCDN
              : defaultConfig.withCDN, */
        };
        setConfig(validatedConfig);
      }
    } catch (error) {
      console.warn(
        "Failed to load config from localStorage, using defaults:",
        error
      );
    }
  }, []);

  const updateConfig = (newConfig: Partial<ConfigType>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig));
    } catch (error) {
      console.error("Failed to save config to localStorage:", error);
    }
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove config from localStorage:", error);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
