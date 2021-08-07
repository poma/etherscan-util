import { ethers } from "ethers";

export interface EtherscanURLs {
  apiURL: string;
  browserURL: string;
}

type NetworkMap = {
  [networkID in NetworkID]: EtherscanURLs;
};

// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
enum NetworkID {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  // Binance Smart Chain
  BSC = 56,
  BSC_TESTNET = 97,
}

const networkIDtoEndpoints: NetworkMap = {
  [NetworkID.MAINNET]: {
    apiURL: "https://api.etherscan.io/api",
    browserURL: "https://etherscan.io/",
  },
  [NetworkID.ROPSTEN]: {
    apiURL: "https://api-ropsten.etherscan.io/api",
    browserURL: "https://ropsten.etherscan.io",
  },
  [NetworkID.RINKEBY]: {
    apiURL: "https://api-rinkeby.etherscan.io/api",
    browserURL: "https://rinkeby.etherscan.io",
  },
  [NetworkID.GOERLI]: {
    apiURL: "https://api-goerli.etherscan.io/api",
    browserURL: "https://goerli.etherscan.io",
  },
  [NetworkID.KOVAN]: {
    apiURL: "https://api-kovan.etherscan.io/api",
    browserURL: "https://kovan.etherscan.io",
  },
  [NetworkID.BSC]: {
    apiURL: "https://api.bscscan.com/api",
    browserURL: "https://bscscan.com",
  },
  [NetworkID.BSC_TESTNET]: {
    apiURL: "https://api-testnet.bscscan.com/api",
    browserURL: "https://testnet.bscscan.com",
  },
};

export async function getEtherscanEndpoints(
  provider: ethers.providers.Provider | ethers.Signer
): Promise<EtherscanURLs> {
  const chainID = provider instanceof ethers.Signer ? await provider.getChainId() : (await provider.getNetwork()).chainId;

  const endpoints = networkIDtoEndpoints[chainID as NetworkID];

  if (endpoints === undefined) {
    throw new Error(
      `An etherscan endpoint could not be found for this network. ChainID: ${chainID}.

Possible causes are:
  - The selected network is wrong.
  - Faulty hardhat network config.

 If you use Mainnet fork mode try setting 'chainId: 1' in hardhat config`
    );
  }

  return endpoints;
}
