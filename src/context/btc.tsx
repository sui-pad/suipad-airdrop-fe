'use client'

import { BitcoinProvider as Provider } from "@/connection/btc";

import { Connector, BitcoinHooks, WALLETS } from "@/connection/btc";

export default function BitcoinProvider({ children }: { children: React.ReactNode }) {
  const connectors = WALLETS.map<[Connector, BitcoinHooks]>(({ hooks, connector }) => [connector, hooks]);

  return <Provider connectors={connectors}>{children}</Provider>
}

