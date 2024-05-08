export enum ChainId {
  MAINNET = 1,
  BNB = 56,
  MANTA_PACIFIC = 169,
  MERLIN_MAINNET = 4200,
}

export const ChainIdToName: Record<ChainId, string> = {
  [ChainId.MAINNET]: "Mainnet",
  [ChainId.BNB]: "BNB Smart Chain Mainnet",
  [ChainId.MANTA_PACIFIC]: "Manta Pacific Mainnet",
  [ChainId.MERLIN_MAINNET]: "Merlin-Mainnet",
};

interface ChainConfig {
  urls: string[];
  name: string;
  nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
  blockExplorerUrls?: string[];
}

type ChainsType = Record<ChainId, ChainConfig>;

export const Chains: ChainsType = {
  [ChainId.MAINNET]: {
    urls: ["https://cloudflare-eth.com"],
    name: ChainIdToName[ChainId.MAINNET],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  [ChainId.BNB]: {
    urls: [
      "https://bsc-dataseed1.bnbchain.org",
      "https://bsc-dataseed2.bnbchain.org",
      "https://bsc-dataseed3.bnbchain.org",
      "https://bsc-dataseed4.bnbchain.org",
    ],
    name: ChainIdToName[ChainId.BNB],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [ChainId.MANTA_PACIFIC]: {
    urls: ["https://pacific-rpc.manta.network/http"],
    name: ChainIdToName[ChainId.MANTA_PACIFIC],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://pacific-explorer.manta.network"],
  },
  [ChainId.MERLIN_MAINNET]: {
    urls: ["https://rpc.merlinchain.io"],
    name: ChainIdToName[ChainId.MANTA_PACIFIC],
    nativeCurrency: {
      name: "BTC",
      symbol: "BTC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://scan.merlinchain.io"],
  },
};
