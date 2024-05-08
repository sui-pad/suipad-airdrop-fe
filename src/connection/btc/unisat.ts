import { Actions, Connector } from "./connector";

export class Unisat extends Connector {
  constructor({ actions }: { actions: Actions }) {
    super(actions);
    if (typeof window === "undefined") return;

    const unisat = (window as any).unisat;

    if (unisat) {
      this.provider = unisat;
    }
  }

  public async activate(): Promise<void> {
    if (!this.provider) return;

    const cancelActivation = this.actions.startActivation();

    try {
      const account = await this.provider.requestAccounts();
      const publicKey = await this.provider.getPublicKey();

      return this.actions.update({ account: account[0], publicKey });
    } catch (error) {
      cancelActivation?.();
      throw error;
    }
  }

  public async getBalance(): Promise<{
    confirmed: number;
    total: number;
    unconfirmed: number;
  }> {
    return await this.provider.getBalance();
  }

  public async signMessage(msg: string, type: "ecdsa" | "bip322-simple" = "ecdsa") {
    return await this.provider.signMessage(msg, type);
  }

  public async signData(data: string, type: "ecdsa" | "schnorr" = "ecdsa") {
    return await this.provider.signData(data, type);
  }
}
