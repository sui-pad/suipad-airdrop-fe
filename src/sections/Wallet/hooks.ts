import { create } from "zustand";

export enum ConnectionState {
  NULL = "NULL",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED"
}

interface WalletType {
  address: string | null
  connectionState: ConnectionState;
  selectConnector: string | null;
  setAddress: (address: string | null) => void
  setSelectConnector: (connector: any) => void
  walletConnectSuccess: () => void
  walletConnecting: () => void
  walletDisconnect: () => void
}

export const useWalletStore = create<WalletType>(set => ({
  address: null,
  connectionState: ConnectionState.NULL,
  selectConnector: null,
  setAddress: (address) => set({ address }),
  setSelectConnector: (connector) => set({ selectConnector: connector }),
  walletConnectSuccess: () => set({ connectionState: ConnectionState.CONNECTED }),
  walletConnecting: () => set({ connectionState: ConnectionState.CONNECTING }),
  walletDisconnect: () => set({ connectionState: ConnectionState.NULL }),
}));

interface WalletDialogType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useWalletDialogStore = create<WalletDialogType>(set => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));