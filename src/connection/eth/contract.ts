import { ChainId } from "./chain";

export const ContractChainId =
  process.env.NEXT_PUBLIC_ENV === "PRO"
    ? ChainId.MERLIN_MAINNET
    : process.env.NEXT_PUBLIC_ENV === "DEV"
      ? ChainId.MERLIN_MAINNET
      : ChainId.BNB;
