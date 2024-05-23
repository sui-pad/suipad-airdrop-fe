import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import {
  useWallets,
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useAutoConnectWallet,
  useSignPersonalMessage,
} from "@mysten/dapp-kit";

import { useCheckLogin, useSuiLogin, useLogout } from "@/hooks/useLoginApi";

import { OptionType } from "./Option";
import { ConnectionState, useWalletStore, useWalletDialogStore } from "./hooks";

import ImgSuiet from "./images/Suiet.png";
import ImgSui from "./images/Sui.png";

const SUI_WALLETS = [
  { icon: ImgSuiet, name: "Suiet" },
  { icon: ImgSui, name: "Sui Wallet" },
];

export default function Sui(props: { renderOption: (option: OptionType) => JSX.Element }) {
  const { renderOption } = props;
  const searchParams = useSearchParams();

  const wallets = useWallets();
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const { mutate: connect } = useConnectWallet();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const { mutate: disconnect } = useDisconnectWallet();
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
  const { trigger: login } = useSuiLogin();
  const { trigger: logout } = useLogout();

  console.log(account, autoConnectionStatus);

  const handleConnect = useCallback(async (walletName: string) => {
    const wallet = wallets.find(item => item.name === walletName);
    if (!wallet) return;

    connect({ wallet });
  }, []);

  const handleLogin = async () => {
    if (!account) return;
    try {
      let isLogin = await checkLogin();

      if (!isLogin || isLogin.walletAddress !== account.address) {
        const nonce = ["Welcome to SuipadAirdrop:", account.address].join("\n");

        const sign = await new Promise<string>((resolve, reject) => {
          const res = signPersonalMessage(
            { message: new TextEncoder().encode(nonce) },
            {
              onSuccess: result => resolve(result.signature),
              onError: err => reject(err),
            },
          );

          console.log(res)
        });

        // nonce: btoa(nonce),
        const code = searchParams.get("code");

        const res = await login({ addr: account.address, sign, code: code ?? "" });

        if (res) isLogin = { walletAddress: account.address };
      }

      if (isLogin) {
        setAddress(account.address);
        closeDialog();
        walletConnectSuccess();
      }
    } catch (error) {
      walletDisconnect();
    }
  };

  const handleDisconnect = async () => {
    disconnect();
    await logout();
    setAddress(null);
    setSelectConnector(null);
  };

  useEffect(() => {
    if (account) {
      walletConnecting();
    } else if (connectionState === ConnectionState.CONNECTED) {
      walletDisconnect();
    }
  }, [account]);

  useEffect(() => {
    if (connectionState === ConnectionState.CONNECTING) {
      handleLogin();
    } else if (connectionState === ConnectionState.NULL) {
      handleDisconnect();
    }
  }, [connectionState]);

  return SUI_WALLETS.map(item => (
    <React.Fragment key={item.name}>
      {renderOption({ ...item, connect: () => handleConnect(item.name) })}
    </React.Fragment>
  ));
}
