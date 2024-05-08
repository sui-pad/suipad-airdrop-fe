import { Connection, ConnectionType, getConnection } from "./connection";

export const connectionKey = "connection_bitcoin_type";

export async function tryActivation(connection: Connection) {
  try {
    await connection.connector.activate();

    return true;
  } catch (error) {
    console.debug(`connection error: ${error}`);
    return false;
  }
}

export async function eagerlyConnect() {
  if (typeof window === "undefined") return;

  const connectionType = getRecentConnectionType();

  if (connectionType) {
    try {
      const selectedConnection = getConnection(connectionType as ConnectionType);

      if (selectedConnection) {
        const connector = selectedConnection.connector;

        if (connector.connectEagerly) {
          await connector.connectEagerly();
        } else {
          await connector.activate();
        }

        return connectionType;
      }
    } catch (error) {
      console.debug(`connection error: ${error}`);
    }
  }

  return false;
}

export async function disconnect() {
  const connectionType = getRecentConnectionType();

  if (connectionType) {
    const selectedConnection = getConnection(connectionType as ConnectionType);

    if (selectedConnection) {
      try {
        await selectedConnection.connector.deactivate?.();
        await selectedConnection.connector.resetState();

        return true;
      } catch (error) {
        console.debug(`disconnect error: ${error}`);
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
