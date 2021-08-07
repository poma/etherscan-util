import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const expect = chai.expect;

import { ethers } from "ethers";
import Utils from "../src/index";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Integration tests", function () {
  // todo add some public RPC for testing
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const utils = new Utils(provider);

  // EIP-2470 Deployer has pretty short ABI, and is deployed on most networks
  const testAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
  const testABI = "function deploy(bytes _initCode, bytes32 _salt) returns (address createdContract)";
  const eoaAddress = "0x000000000000000000000000000000000000dEaD";

  it("should get the Contract ABI from Etherscan", async function () {
    // @ts-ignore
    const contract = await utils.getVerifiedContractAt(testAddress);
    const abi = contract.interface.format();
    expect(abi.length).to.be.equal(1);
    expect(abi[0]).to.be.equal(testABI);
  });

  // todo check if this is still valid
  it.skip("should display rate limit error", async function () {
    // @ts-ignore
    await expect(utils.getVerifiedContractAt(testAddress)).to.be.rejectedWith(
      "Max rate limit reached, please provide an Etherscan API token via constructor\nSee https://etherscan.io/apis"
    );
  });

  it("should detect bad address", async function () {
    // @ts-ignore
    await expect(utils.getVerifiedContractAt("foo")).to.be.rejectedWith(
      "foo is an invalid address."
    );
  });

  it("should correctly fail on unverified contracts", async function () {
    await sleep(10000); // make sure etherscan doesn't rate limit after previous test
    // @ts-ignore
    await expect(utils.getVerifiedContractAt(eoaAddress)).to.be.rejectedWith(
      "The Etherscan API responded with a failure status.\nReason: Contract source code not verified"
    );
  });
});
