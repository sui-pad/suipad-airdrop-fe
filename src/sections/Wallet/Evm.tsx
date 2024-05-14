import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  eagerlyConnect,
  disconnect,
  switchChain,
  setRecentConnectionType,
  getRecentConnectionType,
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

  const { trigger: checkLogin } = useSWRMutation<{ walletAddress: string } | false, any, string>(
    "/user/check_login",
    (url, { arg }) => request(url, { body: arg }),
  );
  const { trigger: login } = useSWRMutation<boolean, any, string, LoginParams>(
    "/user/login",
    (url, { arg }) => request(url, { body: arg }),
  );
  const { trigger: logout } = useSWRMutation<boolean, any, string>("/user/logout", url =>
    request(url),
  );

  const code = searchParams.get("code");

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

  const handleConnect = async (walletConnection: Connection) => {
    if (selectConnector) return;

    setRecentConnectionType(walletConnection.type);

    setSelectConnector(walletConnection);
    const isConnect = await tryActivation(walletConnection);
    setSelectConnector(null);

    if (!isConnect) disconnect();
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

        const res = await login({ addr: account, sign, code: code ?? "" });

        if (res) isLogin = { walletAddress: account };
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
  }, [isEagerlyConnect, provider, isActive, account]);

  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTING) {
      handleLogin();
    } else if (connectionState === ConnectionState.NULL) {
      handleDisconnect();
    }
  }, [isEagerlyConnect, connectionState]);

  return ETH_WALLETS.map(item => renderOption({ ...item, connect: () => handleConnect(item) }));
}
