# etherscan-util [![Build Status](https://github.com/poma/etherscan-util/workflows/build/badge.svg)](https://github.com/poma/etherscan-util/actions) [![npm](https://img.shields.io/npm/v/etherscan-util.svg)](https://www.npmjs.com/package/etherscan-util)

This package allows creating ethers.js contract instances without manually downloading ABI: `etherscanUtil.getVerifiedContractAt('<address>')`. It supports Mainnet, BSC, and most testnets.

## Installation

```bash
npm install etherscan-util
```

## Usage

```js
import ethers from "ethers";
import EtherscanUtil from "etherscan-util";
// You can also use `const EtherscanUtil = require('etherscan-util')`

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const etherscanUtil = new EtherscanUtil(provider, ETHERSCAN_API_KEY);
const contract = await etherscanUtil.getVerifiedContractAt('<address>');
```

It requires only contract address and will fetch the ABI for the contract automatically from Etherscan. If signer is not supplied to getVerifiedContractAt, 
it will initialize contract instance with provider/signer that was supplied to EtherscanUtil constructor.

Here are function definitions:

```typescript
function constructor(
  providerOrSigner: ethers.providers.Provider | ethers.Signer, 
  etherscanApiKey?: string);

async function getVerifiedContractAt(
  address: string,
  signer?: ethers.Signer
): Promise<ethers.Contract>;
```

