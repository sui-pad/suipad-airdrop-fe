import { useCallback } from "react";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui.js/bcs";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { formatUnits } from "@ethersproject/units";

const POOL_PACKAGE = "0xb8ce95d0b6a53350396b2f4fc92f8bbfe3c095778b050d34836a65503aa66c42";
const CLAIM_PACKAGE = "0xbca50b4abc7b1ecf60a17cec682ac042b0f1c64d8bdb24f8b317c3af2361b939";

const SUIP_TYPE = "0x072df455e324af1cd28041ba790a0feed408dc019e594341a79a4c3594d3bfbc::SUIP::SUIP";

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

      // txBlock.setGasBudget(1e9);
      txBlock.moveCall({
        target: `${CLAIM_PACKAGE}::claim::claim`,
        typeArguments: [SUIP_TYPE],
        arguments: [txBlock.object(POOL_PACKAGE),
          txBlock.object('0x6'),
        ],
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
          onError: (e) => {
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

    // txBlock.setGasBudget(1e9);
    txBlock.moveCall({
      target: `${CLAIM_PACKAGE}::claim::claimed_amount`,  // 未领取数量
      typeArguments: [SUIP_TYPE],
      arguments: [txBlock.object(POOL_PACKAGE)],
    });

    const res = await client.devInspectTransactionBlock({
      sender: account.address,
      transactionBlock: txBlock,
    });

    if (res.results) {
      const [claimd] = (res.results?.[0].returnValues ?? []).map(([value, type]) =>
        formatUnits(bcs.de(type, Uint8Array.from(value)), 9),
      );

      return claimd
    }
  }, [client, account]);
}