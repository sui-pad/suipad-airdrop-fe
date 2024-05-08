import { createStore } from "zustand";

import { BitcoinState, BitcoinStore, BitcoinStateUpdate, Actions } from "./connector";

const DEFAULT_STATE: BitcoinState = {
  publicKey: undefined,
  account: undefined,
  activating: false,
};

export function createBitcoinStoreAndActions(): [BitcoinStore, Actions] {
  const store = createStore<BitcoinState>()(() => DEFAULT_STATE);

  // flag for tracking updates so we don't clobber data when cancelling activation
  let nullifier = 0;

  function startActivation(): () => void {
    const nullifierCached = ++nullifier;

    store.setState({ ...DEFAULT_STATE, activating: true });

    // return a function that cancels the activation iff nothing else has happened
    return () => {
      if (nullifier === nullifierCached) store.setState({ activating: false });
    };
  }

  function update(stateUpdate: BitcoinStateUpdate): void {
    nullifier++;

    store.setState((existingState): BitcoinState => {
      const account = stateUpdate.account ?? existingState.account;
      const publicKey = stateUpdate.publicKey ?? existingState.publicKey;

      let activating = existingState.activating;

      if (activating && account && publicKey) {
        activating = false;
      }

      return { account, publicKey, activating };
    });
  }

  function resetState(): void {
    nullifier++;
    store.setState(DEFAULT_STATE);
  }

  return [store, { startActivation, update, resetState }];
}
