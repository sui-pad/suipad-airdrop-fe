"use client";

import { useSearchParams } from "next/navigation";

import { useEffect } from "react";

import { useWeb3React } from "@web3-react/core";

import useSWRMutation from "swr/mutation";

import {
  ChainId,
  Connection,
  metamaskBase,
  okxBase,
  tokenpocketBase,
  gateBase,
  bitgetBase,
  tryActivation,
  switchChain,
  disconnect,
  setRecentConnectionType,
} from "@/connection/eth";
import request from "@/utils/request";

import { useWalletStore, useWalletDialogStore, ConnectionState } from "./hooks";

import ImgMetamask from "./images/Metamask.png";
import ImgOkx from "./images/Okx.png";
import ImgTokenpocket from "./images/Tokenpocket.png";
import ImgGate from "./images/Gate.png";
import ImgBitget from "./images/Bitget.png";

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

interface LoginParams {
  addr: string;
  sign: string;
  code: string | null;
}

export default function Evm(props: { renderOption: (option: EvmConnection) => JSX.Element }) {
  const { renderOption } = props;
  const searchParams = useSearchParams();
  const { isActive, account, provider, chainId } = useWeb3React();
  const {
    connectionState,
    selectConnector,
    setSelectConnector,
    setAddress,
    walletConnectSuccess,
    walletConnecting,
    walletDisconnect,
  } = useWalletStore();
  const { closeDialog } = useWalletDialogStore();

  const { trigger: checkLogin } = useSWRMutation<boolean, any, string>(
    "/user/check_login",
    (url, { arg }) => request(url, { body: arg }),
  );
  const { trigger: login } = useSWRMutation<boolean, any, string, LoginParams>(
    "/user/login",
    (url, { arg }) => request(url, { body: arg }),
  );

  const code = searchParams.get("code")

  const handleConnect = async (walletConnection: Connection) => {
    if (selectConnector) return;

    setSelectConnector(walletConnection);
    setRecentConnectionType(walletConnection.type);

    const isConnect = await tryActivation(walletConnection);

    if (!isConnect) {
      disconnect();
      setSelectConnector(null);
    }
  };

  const handleLogin = async () => {
    if (!account || !provider) return;
    try {
      if (chainId !== ChainId.BNB) {
        await switchChain(ChainId.BNB);
      }

      let isLogin = await checkLogin();

      if (!isLogin) {
        const nonce = ["Welcome to SuipadAirdrop:", account].join("\n");

        const sign = await provider.getSigner().signMessage(nonce);

        const res = await login({ addr: account, sign, code: code ?? "" });

        isLogin = res;
      }

      if (isLogin) {
        setAddress(account);
        closeDialog();
        walletConnectSuccess();
      }
    } catch (error) {
      disconnect();
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setSelectConnector(null);
  };

  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTING) {
      handleLogin();
    } else if (connectionState === ConnectionState.NULL) {
      handleDisconnect();
    }
  }, [connectionState]);

  useEffect(() => {
    if (isActive && account && provider) {
      walletConnecting();
    } else {
      walletDisconnect();
    }
  }, [provider, isActive, account]);

  return ETH_WALLETS.map(item => renderOption({ ...item, connect: () => handleConnect(item) }));
}
