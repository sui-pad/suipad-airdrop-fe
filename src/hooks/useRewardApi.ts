// /claim/signature

import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { ConnectionState, useWalletStore } from "@/sections/Wallet/hooks";
import request from "@/utils/request";

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
