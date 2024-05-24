import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";

import { WALLET_LIST } from "@/connection/eth";

export default function EvmProvider({ children }: { children: React.ReactNode }) {
  const connectors = WALLET_LIST.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks]);

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}