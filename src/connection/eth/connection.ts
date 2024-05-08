import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { InjectedWalletProvider, InjectedWallet } from "./injectedWallet";

import { ChainId } from "./chain";

import { StaticImageData } from "next/image";

export enum ConnectionType {
  METAMASK = "METAMASK",
  TOKENPOCKET = "TOKENPOCKET",
  OKX = "OKX",
  GATE = "GATE",
  BITGET = "BITGET",
  WALLETCONNECT = "WALLETCONNECT",
  CLOVER = "CLOVER",
}

export interface BaseConnection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export interface Connection extends BaseConnection {
  name: string;
  icon: StaticImageData;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

const [metamaskInjected, metamaskInjectedHooks] = initializeConnector<InjectedWallet<{ isMetaMask: boolean }>>(
  actions =>
    new InjectedWallet({
      actions,
      getProvider: async () => {
        return new Promise(resolve => {
          import("@metamask/detect-provider").then(async m => {
            let provider = (await m.default()) as InjectedWalletProvider<{ isMetaMask: boolean }>;

            if (provider) {
              if (provider.providers?.length) {
                provider = provider.providers.find(p => p.isMetaMask) ?? provider.providers[0];
              }
            }

            resolve(provider);
          });
        });
      },
      onError,
    }),
);

const [okxInjected, okxInjectedHooks] = initializeConnector<InjectedWallet<{ okxwallet: boolean }>>(
  actions =>
    new InjectedWallet({
      actions,
      getProvider: () => {
        let provider = (window as any)?.okxwallet as InjectedWalletProvider<{ okxwallet: boolean }>;

        if (provider) {
          if (provider.providers?.length) {
            provider = provider.providers.find(p => p.okxwallet) ?? provider.providers[0];
          }
        }

        return provider;
      },
      onError,
    }),
);

const [tokenpocketInjected, tokenpocketInjectedHooks] = initializeConnector<InjectedWallet<{ okxwallet: boolean }>>(
  actions =>
    new InjectedWallet({
      actions,
      getProvider: () => {
        let provider = (window as any)?.ethereum as InjectedWalletProvider<{ okxwallet: boolean }>;

        if (provider) {
          if (provider.providers?.length) {
            provider = provider.providers.find(p => p.okxwallet) ?? provider.providers[0];
          }
        }

        return provider;
      },
      onError,
    }),
);

const [gateInjected, gateInjectedHooks] = initializeConnector<InjectedWallet<{ isWeb3Wallet: boolean }>>(
  actions =>
    new InjectedWallet({
      actions,
      getProvider: () => {
        let provider = (window as any)?.gatewallet as InjectedWalletProvider<{ isWeb3Wallet: boolean }>;

        if (provider) {
          if (provider.providers?.length) {
            provider = provider.providers.find(p => p.isWeb3Wallet) ?? provider.providers[0];
          }
        }

        return provider;
      },
      onError,
    }),
);

const [bitgetInjected, bitgetInjectedHooks] = initializeConnector<InjectedWallet<{ isBitKeep: boolean }>>(
  actions =>
    new InjectedWallet({
      actions,
      getProvider: () => {
        let provider = (window as any)?.bitkeep.ethereum as InjectedWalletProvider<{ isBitKeep: boolean }>;

        if (provider) {
          if (provider.providers?.length) {
            provider = provider.providers.find(p => p.isBitKeep) ?? provider.providers[0];
          }
        }

        return provider;
      },
      onError,
    }),
);

// const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
//   (actions) =>
//     new CoinbaseWallet({
//       actions,
//       options: {
//         url: APP_RPC_URLS[ChainId.MAINNET][0],
//         appName: 'Uniswap',
//         appLogoUrl: UNISWAP_LOGO,
//         reloadOnDisconnect: false,
//       },
//       onError,
//     })
// )

const [walletConnector, walletConnectorHooks] = initializeConnector<WalletConnectV2>(
  actions =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: "2a3f6248e06d1e4cfd16da799ae34534",
        chains: [ChainId.MAINNET],
        showQrModal: true,
      },
    }),
);

export const metamaskBase: BaseConnection = {
  type: ConnectionType.METAMASK,
  connector: metamaskInjected,
  hooks: metamaskInjectedHooks,
};

export const walletConnectorBase: BaseConnection = {
  type: ConnectionType.WALLETCONNECT,
  connector: walletConnector,
  hooks: walletConnectorHooks,
};

export const okxBase: BaseConnection = {
  type: ConnectionType.OKX,
  connector: okxInjected,
  hooks: okxInjectedHooks,
};

export const gateBase: BaseConnection = {
  type: ConnectionType.GATE,
  connector: gateInjected,
  hooks: gateInjectedHooks,
};

export const bitgetBase: BaseConnection = {
  type: ConnectionType.BITGET,
  connector: bitgetInjected,
  hooks: bitgetInjectedHooks,
};

export const tokenpocketBase: BaseConnection = {
  type: ConnectionType.TOKENPOCKET,
  connector: tokenpocketInjected,
  hooks: tokenpocketInjectedHooks,
};

export const WALLET_LIST = [metamaskBase, okxBase, tokenpocketBase, gateBase, bitgetBase, walletConnectorBase];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = WALLET_LIST.find(connection => connection.connector === c);
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.METAMASK:
        return metamaskBase;
      case ConnectionType.OKX:
        return okxBase;
      case ConnectionType.GATE:
        return gateBase;
      case ConnectionType.BITGET:
        return bitgetBase;
      case ConnectionType.TOKENPOCKET:
        return tokenpocketBase;
      case ConnectionType.WALLETCONNECT:
        return walletConnectorBase;
    }
  }
}
