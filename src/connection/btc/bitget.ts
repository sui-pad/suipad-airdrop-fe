import { Actions, Connector } from "./connector";

export class Bitget extends Connector {
  constructor({ actions }: { actions: Actions }) {
    super(actions);
    if (typeof window === "undefined") return;

    const bitget = (window as any)?.bitkeep?.unisat;

    if (bitget) {
      this.provider = bitget;
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

  public async getBalance() {
    return await this.provider.getBalance();
  }

  public async signMessage(msg: string, type: "ecdsa" | "bip322-simple" = "ecdsa") {
    return await this.provider.signMessage(msg, type);
  }

  public async signData(data: string, type: "ecdsa" | "schnorr" = "ecdsa") {
    return await this.provider.signData(data, type);
  }
}
