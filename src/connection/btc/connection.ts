import { StaticImageData } from "next/image";

import { Connector } from "./connector";
import { BitcoinHooks, initializeConnector } from "./initializeConnector";
import { Unisat } from "./unisat";
import { Okx } from "./okx";
import { Bitget } from "./bitget";

export enum ConnectionType {
  UNISAT = "UNISAT",
  OKX = "OKX",
  BITGET = "BITGET",
}

export interface BaseConnection {
  connector: Connector;
  hooks: BitcoinHooks;
  type: ConnectionType;
}

export interface Connection extends BaseConnection {
  name: string;
  icon: StaticImageData;
}

export const [unisatInjected, unisatInjectedHooks] = initializeConnector<Unisat>(
  actions => new Unisat({ actions }),
);

export const [okxInjected, okxInjectedHooks] = initializeConnector<Okx>(
  actions => new Okx({ actions }),
);

export const [bitgetInjected, bitgetInjectedHooks] = initializeConnector<Okx>(
  actions => new Bitget({ actions }),
);

export const unisatBase: BaseConnection = {
  connector: unisatInjected,
  hooks: unisatInjectedHooks,
  type: ConnectionType.UNISAT,
}

export const okxBase: BaseConnection = {
  connector: okxInjected,
  hooks: okxInjectedHooks,
  type: ConnectionType.OKX,
}

export const bitgetBase: BaseConnection = {
  connector: bitgetInjected,
  hooks: bitgetInjectedHooks,
  type: ConnectionType.BITGET,
}

export const WALLETS = [unisatBase, okxBase, bitgetBase];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = WALLETS.find(connection => connection.connector === c);
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.UNISAT:
        return unisatBase;
      case ConnectionType.OKX:
        return okxBase;
      case ConnectionType.BITGET:
        return bitgetBase;
    }
  }
}