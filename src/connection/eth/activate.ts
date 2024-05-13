import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { ChainId, Chains } from "./chain";
import { Connection, ConnectionType, getConnection } from "./connection";

export const connectionKey = "evm_connection_type";

export async function tryActivation(connection: Connection) {
  try {
    await connection.connector.activate();

    return true;
  } catch (error) {
    console.debug(`web3-react connection error: ${error}`);
    return false;
  }
}

export async function eagerlyConnect(connectionType: ConnectionType) {
  if (typeof window === "undefined") return;

  try {
    const selectedConnection = getConnection(connectionType as ConnectionType);

    if (selectedConnection) {
      const connector = selectedConnection.connector;

      if (connector.connectEagerly) {
        await connector.connectEagerly();
      } else {
        await connector.activate();
      }

      return true;
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }

  return false;
}

export async function disconnect() {
  const connectionType = getRecentConnectionType();

  if (connectionType) {
    const selectedConnection = getConnection(connectionType as ConnectionType);

    if (selectedConnection) {
      try {
        const { connector } = selectedConnection;

        await connector.deactivate?.();
        await connector.resetState();
        setRecentConnectionType(undefined);

        return true;
      } catch (error) {
        console.debug(`web3-react eager disconnect error: ${error}`);
      }
    }
  }

  return false;
}

function getAddChainParameters(chainId: ChainId) {
  const chainInformation = Chains[chainId]
  if (chainInformation) {
    return {
      chainId,
      chainName: chainInformation.name,
      rpcUrls: chainInformation.urls,
      nativeCurrency: chainInformation.nativeCurrency,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

export async function switchChain(chainId: ChainId = ChainId.MAINNET) {
  const connectionType = getRecentConnectionType();

  if (connectionType) {
    const selectedConnection = getConnection(connectionType as ConnectionType);

    if (selectedConnection) {
      try {
        const connector = selectedConnection.connector;

        if (connector instanceof WalletConnectV2) {
          await connector.activate(chainId);
        } else {
          await connector.activate(getAddChainParameters(chainId))
        }

        return true;
      } catch (error) {
        console.debug(`web3-react eager switchChain error: ${error}`);
      }
    }
  }

  return false;
}

function isRecentConnection(value: any): value is ConnectionType {
  return value in ConnectionType;
}

export function getRecentConnectionType(): ConnectionType | undefined {
  const value = localStorage.getItem(connectionKey);
  if (!value) return;

  try {
    if (isRecentConnection(value)) return value;
  } catch (error) {
    console.debug(`web3-react eager getRecentConnectionType error: ${error}`);
  }
  // If meta is invalid or there is an error, clear it from local storage.
  setRecentConnectionType(undefined);
  return;
}

export function setRecentConnectionType(connectionType: ConnectionType | undefined) {
  if (!connectionType) return localStorage.removeItem(connectionKey);

  localStorage.setItem(connectionKey, connectionType);
}
