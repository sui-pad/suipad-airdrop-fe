import { useStore } from "zustand";
import { Actions, BitcoinState, BitcoinStore, Connector } from "./connector";
import { createBitcoinStoreAndActions } from "./store";

export type BitcoinHooks = ReturnType<typeof getStateHooks>;

const ACCOUNT = ({ account }: BitcoinState) => account
const PUBLIC_KYE = ({ publicKey }: BitcoinState) => publicKey
const ACTIVATING = ({ activating }: BitcoinState) => activating

function getStateHooks(store: BitcoinStore) {
  function useAccount(): BitcoinState['account'] {
    return useStore(store, ACCOUNT);
  }

  function usePublicKey(): BitcoinState['publicKey'] {
    return useStore(store, PUBLIC_KYE);
  }

  function useIsActivating(): BitcoinState['activating'] {
    return useStore(store, ACTIVATING)
  }

  function useIsActive(): boolean {
    const account = useAccount();
    const publicKey = usePublicKey();
    const activating = useIsActivating();
    
    return Boolean(account && publicKey && !activating);
  }

  return { useAccount, usePublicKey, useIsActivating, useIsActive };
}

export function initializeConnector<T extends Connector>(f: (actions: Actions) => T): [T, BitcoinHooks, BitcoinStore] {
  const [store, actions] = createBitcoinStoreAndActions();

  const connector = f(actions);
  const stateHooks = getStateHooks(store);

  return [connector, { ...stateHooks }, store];
}
