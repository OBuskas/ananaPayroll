import {
  SIZE_CONSTANTS,
  type Synapse,
  TIME_CONSTANTS,
  TOKENS,
  WarmStorageService,
} from "@filoz/synapse-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_UINT256 } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateStorageMetrics = async (
  synapse: Synapse,
  config: {
    storageCapacity: number;
    persistencePeriod: number;
    minDaysThreshold: number;
  },
  fileSize?: number
) => {
  const bytesToStore = fileSize
    ? fileSize
    : Number(BigInt(config.storageCapacity) * SIZE_CONSTANTS.GiB);

  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  );

  // Fetch approval info, storage costs, and balance in parallel
  const [allowance, accountInfo, prices] = await Promise.all([
    synapse.payments.serviceApproval(synapse.getWarmStorageAddress()),
    synapse.payments.accountInfo(TOKENS.USDFC),
    warmStorageService.calculateStorageCost(bytesToStore),
  ]);

  const availableFunds = accountInfo.availableFunds;

  const currentMonthlyRate =
    allowance.rateUsed * TIME_CONSTANTS.EPOCHS_PER_MONTH;

  const currentDailyRate = allowance.rateUsed * TIME_CONSTANTS.EPOCHS_PER_DAY;

  const maxMonthlyRate = prices.perMonth;

  const daysLeft = Number(availableFunds) / Number(prices.perDay);

  const daysLeftAtCurrentRate =
    currentDailyRate === BigInt(0)
      ? Number.POSITIVE_INFINITY
      : Number(availableFunds) / Number(currentDailyRate);

  const amountNeeded = prices.perDay * BigInt(config.persistencePeriod);

  const totalDepositNeeded =
    daysLeft >= config.minDaysThreshold
      ? BigInt(0)
      : amountNeeded - accountInfo.availableFunds;

  const availableToFreeUp =
    accountInfo.availableFunds > amountNeeded
      ? accountInfo.availableFunds - amountNeeded
      : BigInt(0);

  const isRateSufficient = allowance.rateAllowance >= MAX_UINT256 / BigInt(2);

  const isLockupSufficient =
    allowance.lockupAllowance >= MAX_UINT256 / BigInt(2);

  const isSufficient =
    isRateSufficient &&
    isLockupSufficient &&
    daysLeft >= config.minDaysThreshold;

  return {
    rateNeeded: MAX_UINT256,
    depositNeeded: totalDepositNeeded,
    availableToFreeUp,
    lockupNeeded: MAX_UINT256,
    daysLeft,
    daysLeftAtCurrentRate,
    isRateSufficient,
    isLockupSufficient,
    isSufficient,
    totalConfiguredCapacity: config.storageCapacity,
    currentMonthlyRate,
    maxMonthlyRate,
  };
};
