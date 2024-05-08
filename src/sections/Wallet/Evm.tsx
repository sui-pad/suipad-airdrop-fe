import { useWeb3React } from "@web3-react/core";
import {
  Connection,
  metamaskBase,
  okxBase,
  tokenpocketBase,
  gateBase,
  bitgetBase,
  tryActivation,
  disconnect,
  setRecentConnectionType,
  eagerlyConnect,
} from "@/connection/eth";

import { useWalletStore, useWalletDialogStore } from "./hooks";

import ImgMetamask from "./images/Metamask.png";
import ImgOkx from "./images/Okx.png";
import ImgTokenpocket from "./images/Tokenpocket.png";
import ImgGate from "./images/Gate.png";
import ImgBitget from "./images/Bitget.png";
import { useEffect } from "react";

export const ETH_WALLETS: Connection[] = [
  { ...metamaskBase, name: "MetaMask", icon: ImgMetamask },
  { ...okxBase, name: "OKX Wallet", icon: ImgOkx },
  { ...tokenpocketBase, name: "TokenPocket", icon: ImgTokenpocket },
  { ...gateBase, name: "Gate", icon: ImgGate },
  { ...bitgetBase, name: "Bitget Wallet", icon: ImgBitget },
];

export interface EvmConnection extends Connection {
  connect: () => void;
}

export default function Evm(props: { renderOption: (option: EvmConnection) => JSX.Element }) {
  const { renderOption } = props;
  const { isActive, account, chainId } = useWeb3React();
  const {
    selectConnector,
    setSelectConnector,
    setAddress,
    walletConnectSuccess,
    walletDisconnect,
  } = useWalletStore();
  const { closeDialog } = useWalletDialogStore();

  const handleConnect = async (walletConnection: Connection) => {
    if (selectConnector) return;

    setSelectConnector(walletConnection);

    const isConnect = await tryActivation(walletConnection);

    if (isConnect) {
      setRecentConnectionType(walletConnection.type);
      closeDialog();
    } else {
      disconnect();
      setSelectConnector(null);
      // showTips("Wallet is Not Installed");
    }
  };

  useEffect(() => {
    if (isActive && account) {
      setAddress(account);
      walletConnectSuccess();
    } else {
      setAddress(null);
      walletDisconnect();
    }
  }, [isActive, account]);

  return ETH_WALLETS.map(item => renderOption({ ...item, connect: () => handleConnect(item) }));
}
