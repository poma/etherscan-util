import { toGetAbiRequest } from "./etherscan/EtherscanGetAbiRequest";
import { EtherscanURLs, getEtherscanEndpoints } from "./network/prober";
import { getAbi } from "./etherscan/EtherscanService";
import { ethers } from "ethers";

export default class EtherscanUtil {
  public readonly providerOrSigner: ethers.providers.Provider | ethers.Signer;

  private readonly apiKey?: string;

  private endpoint?: EtherscanURLs;

  public constructor(providerOrSigner: ethers.providers.Provider | ethers.Signer, etherscanApiKey?: string) {
    this.providerOrSigner = providerOrSigner;
    this.apiKey = etherscanApiKey;
  }

  public async getVerifiedContractAt(
    address: string,
    signer?: ethers.Signer
  ): Promise<ethers.Contract> {
    const { isAddress } = await import("@ethersproject/address");
    if (!isAddress(address)) {
      throw new Error(`${address} is an invalid address.`);
    }
  
    if (!this.endpoint) {
      this.endpoint = await getEtherscanEndpoints(this.providerOrSigner);
    }
    const request = toGetAbiRequest({
      // @ts-ignore
      apiKey: this.apiKey ?? "",
      address,
    });
    const abi = await getAbi(this.endpoint.apiURL, request);
  
    return new ethers.Contract(address, abi, signer ?? this.providerOrSigner);
  }
}