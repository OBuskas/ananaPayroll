import { MaxUint256 } from "ethers";

export const MAX_UINT256 = MaxUint256;

/** Dataset creation fee: 0.1 USDFC (prevents spam, covers network costs) */
export const CDN_DATA_SET_CREATION_COST = BigInt(`1${"0".repeat(18)}`);

/** Merkle tree leaf size (32 bytes) for storage calculations */
export const LEAF_SIZE = BigInt(32);
