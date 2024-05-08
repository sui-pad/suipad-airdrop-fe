import type { StoreApi } from "zustand";

export interface BitcoinState {
  account: string | undefined;
  publicKey: string | undefined;
  activating: boolean;
}

export type BitcoinStore = StoreApi<BitcoinState>;

export type BitcoinStateUpdate = Omit<BitcoinState, "activating" | "active">

export interface Actions {
  startActivation: () => () => void;
  update: (stateUpdate: BitcoinStateUpdate) => void;
  resetState: () => void;
}

export abstract class Connector {
  public provider?: any

  protected readonly actions: Actions;

  constructor(actions: Actions) {
    this.actions = actions;
  }

  public resetState(): Promise<void> | void {
    this.actions.resetState();
  }

  public abstract activate(...args: unknown[]): Promise<void> | void

  public connectEagerly?(...args: unknown[]): Promise<void> | void

  public deactivate?(...args: unknown[]): Promise<void> | void

  public abstract getBalance(): Promise<any> | any

  public abstract signMessage(...args: unknown[]): Promise<string> | string
  
  public abstract signData(...args: unknown[]): Promise<string> | string
}
