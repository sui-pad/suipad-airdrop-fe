import { useCallback } from "react";
import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui.js/bcs";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { formatUnits } from "@ethersproject/units";

const POOL_PACKAGE = "0x16e84651a100bb467911bb9c447a541fe067ec0aefa7358b6c2e962dfc6bf177";
const CLAIM_PACKAGE = "0x7984fa3914cc238288741c8995a8b772d6923366f718258cb27bff1d0b8ccd3a";

const SUIP_TYPE = "0xe4239cd951f6c53d9c41e25270d80d31f925ad1655e5ba5b543843d4a66975ee::SUIP::SUIP";

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
        target: `${CLAIM_PACKAGE}::airdrop::claim_entry`,
        typeArguments: [SUIP_TYPE],
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

    // txBlock.setGasBudget(1e9);
    txBlock.moveCall({
      target: `${CLAIM_PACKAGE}::airdrop::claim`,
      typeArguments: [SUIP_TYPE],
      arguments: [txBlock.object(POOL_PACKAGE)],
    });

    const res = await client.devInspectTransactionBlock({
      sender: account.address,
      transactionBlock: txBlock,
    });

    if (res.results) {
      const [_, claimd] = (res.results?.[0].returnValues ?? []).map(([value, type]) =>
        formatUnits(bcs.de(type, Uint8Array.from(value)), 9),
      );

      return claimd
    }
  }, [client, account]);
}