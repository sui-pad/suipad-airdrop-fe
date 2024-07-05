import { useCallback } from "react";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui.js/bcs";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { formatUnits } from "@ethersproject/units";

const POOL_PACKAGE = "0x93a88d45322a6657330210e3b6d0e90a0219f6ce0a008a45a96aea6a2a06d43b";
const CLAIM_PACKAGE = "0x7c70733471e08a0582ca64ed4f602e4154abdf46ea14b0fb128ab1706d499bfe";

const SSBT_TYPE = "0x438f52246972c0868fd3cc01034f77e34ff90082b1cebdb0549e0a1031f9f62e::ssbt::SSBT";

export interface ClainStateType {
  totalReward: string;
  claimd: string;
  unclaim: string;
}

export function useClaimReward() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

  return useCallback(() => {
    if (!account) return;

    return new Promise((resolve, reject) => {
      const txBlock = new TransactionBlock();

      txBlock.setGasBudget(1e9);
      txBlock.moveCall({
        target: `${CLAIM_PACKAGE}::airdrop::claim_entry`,
        typeArguments: [SSBT_TYPE],
        arguments: [txBlock.object(POOL_PACKAGE)],
      });

      signAndExecuteTransactionBlock(
        {
          transactionBlock: txBlock,
          options: { showEffects: true },
        },
        {
          onSuccess: () => {
            resolve(true);
          },
          onError: () => {
            reject(false);
          },
        },
      );
    });
  }, [client, account]);
}

export function useClaimState() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return useCallback(async (): Promise<string | undefined> => {
    if (!account) return;

    const txBlock = new TransactionBlock();

    txBlock.setGasBudget(1e9);
    txBlock.moveCall({
      target: `${CLAIM_PACKAGE}::airdrop::claim`,
      typeArguments: [SSBT_TYPE],
      arguments: [txBlock.object(POOL_PACKAGE)],
    });

    const res = await client.devInspectTransactionBlock({
      sender: account.address,
      transactionBlock: txBlock,
    });

    if (res.results) {
      console.log(res.results);
      const [_, claimd] = (res.results?.[0].returnValues ?? []).map(([value, type]) =>
        formatUnits(bcs.de(type, Uint8Array.from(value)), 9),
      );

      return claimd
    }
  }, [client, account]);
}