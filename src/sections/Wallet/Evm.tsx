import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  ChainId,
  Connection,
  metamaskBase,
  okxBase,
  tokenpocketBase,
  gateBase,
  bitgetBase,
  tryActivation,
  eagerlyConnect,
  disconnect,
  switchChain,
  setRecentConnectionType,
  getRecentConnectionType,
} from "@/connection/eth";

import { useCheckLogin, useEvmLogin, useLogout } from "@/hooks/useLoginApi";

import { OptionType } from "./Option";
import { ConnectionState, useWalletStore, useWalletDialogStore } from "./hooks";

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

export default function Evm(props: { renderOption: (option: OptionType) => JSX.Element }) {
  const { renderOption } = props;
  const searchParams = useSearchParams();
  const [isEagerlyConnect, setEagerlyConnect] = useState<boolean>(false);
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

  const { trigger: checkLogin } = useCheckLogin();
  const { trigger: login } = useEvmLogin();
  const { trigger: logout } = useLogout();

  // console.log(isActive, account,);

  const handleConnect = async (walletConnection: Connection) => {
    if (selectConnector) return;

    setRecentConnectionType(walletConnection.type);

    setSelectConnector(walletConnection);
    await tryActivation(walletConnection);
    setSelectConnector(null);
  };

  const handleEagerlyConnect = async () => {
    const connectionType = getRecentConnectionType();

    if (connectionType) {
      setEagerlyConnect(true);
      const res = await eagerlyConnect(connectionType);
      if (!res) walletDisconnect();
    } else {
      setEagerlyConnect(false);
    }
  };

  const handleLogin = async () => {
    if (!account || !provider) return;
    try {
      if (chainId !== ChainId.BNB) {
        await switchChain(ChainId.BNB);
      }

      let isLogin = isEagerlyConnect && (await checkLogin());

      if (!isLogin || isLogin.walletAddress !== account) {
        const nonce = ["Welcome to SuipadAirdrop:", account].join("\n");

        const sign = await provider.getSigner().signMessage(nonce);
        const code = searchParams.get("code");

        const res = await login({ addr: account, sign, code: code ?? "" });

        if (res) isLogin = { walletAddress: account };
      }

      if (isLogin) {
        setAddress(account);
        closeDialog();
        walletConnectSuccess();
      }
    } catch (error) {
      walletDisconnect();
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    await logout();
    setAddress(null);
    setSelectConnector(null);
    setEagerlyConnect(false);
  };

  useEffect(() => {
    handleEagerlyConnect();
  }, []);

  useEffect(() => {
    if (isActive && account && provider) {
      walletConnecting();
    } else if (connectionState === ConnectionState.CONNECTED) {
      walletDisconnect();
    }
  }, [provider, isActive, account]);

  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTING) {
      handleLogin();
    } else if (connectionState === ConnectionState.NULL) {
      handleDisconnect();
    }
  }, [connectionState]);

  return ETH_WALLETS.map(item => (
    <React.Fragment key={item.name}>
      {renderOption({ ...item, connect: () => handleConnect(item) })}
    </React.Fragment>
  ));
}
