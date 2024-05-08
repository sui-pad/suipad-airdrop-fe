import React, { createContext, useContext } from "react";

import { Connector, BitcoinStore } from "./connector";
import { BitcoinHooks } from "./initializeConnector";

export type BitcoinContextType = {
  provider?: Connector
  account?: string;
  publicKey?: string;
  isActive: boolean;
  isActivating: boolean;
};

const BitcoinContext = createContext<BitcoinContextType | undefined>(undefined);

export function BitcoinProvider({ children, connectors }: {
  children: React.ReactNode;
  connectors: [Connector, BitcoinHooks][] | [Connector, BitcoinHooks, BitcoinStore][]
}) {

  const values = connectors.map(([, { useIsActive }]) => useIsActive())
  const index = values.findIndex((isActive) => isActive)

  const [connector, connectorHooks] = connectors[index === -1 ? 0 : index]

  const account = connectorHooks.useAccount();
  const publicKey = connectorHooks.usePublicKey();
  const isActive = connectorHooks.useIsActive();
  const isActivating = connectorHooks.useIsActivating();

  return (
    <BitcoinContext.Provider
      value={{
        provider: connector,
        account,
        publicKey,
        isActive,
        isActivating
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
}

export function useBitcoinReact(): BitcoinContextType {
  const context = useContext(BitcoinContext);
  if (!context) throw Error("BitcoinProvider component");
  return context;
}
