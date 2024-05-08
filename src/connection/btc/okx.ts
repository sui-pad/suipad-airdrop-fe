import { Actions, Connector } from "./connector";

export class Okx extends Connector {
  constructor({ actions }: { actions: Actions }) {
    super(actions);
    if (typeof window === "undefined") return;

    const okxwallet = (window as any).okxwallet;

    if (okxwallet) {
      this.provider = okxwallet.bitcoin;
    }
  }

  public async activate(): Promise<void> {
    if (!this.provider) return;

    const cancelActivation = this.actions.startActivation();

    try {
      const result = await this.provider.connect();

      return this.actions.update({ account: result.address, publicKey: result.compressedPublicKey });
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
