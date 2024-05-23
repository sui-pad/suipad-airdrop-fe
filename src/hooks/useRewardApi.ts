import useSWR from "swr";

import { ConnectionState, useWalletStore } from "@/sections/Wallet/hooks";

interface RewardType {
  logo: string
  tokenName: string
  balance: number
  claimed: number
  freeze: number
  totalAirdrop: number
  totalRealse: number
}

export function useRewardInfo(jobId: string) {
  const { connectionState } = useWalletStore();

  return useSWR<RewardType>(["/claim/info", { body: { jobId } }, [connectionState === ConnectionState.CONNECTED]]);
}
