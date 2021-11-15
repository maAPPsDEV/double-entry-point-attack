import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber, constants } from "ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { Hacker } from "../typechain";

chai.use(solidity);

describe("Hacker", () => {
  let deployer: SignerWithAddress;
  let hacker: Hacker;

  before(async () => {
    await deployments.fixture(["Hacker"]);
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    hacker = await ethers.getContract("Hacker");
  });

  it("should assert true", async () => {
    expect(await hacker.hacker()).to.be.equal(deployer.address);
  });
});
