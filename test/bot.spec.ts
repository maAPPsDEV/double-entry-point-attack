import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { CryptoVault, DoubleEntryPoint, Forta, IERC20 } from "../typechain";

chai.use(solidity);

describe("DetectionBot", () => {
  let deployer: SignerWithAddress;
  let player: SignerWithAddress;

  let det: DoubleEntryPoint;
  let vault: CryptoVault;

  before(async () => {
    await deployments.fixture(["CryptoVault"]);
    deployer = await ethers.getSigner((await getNamedAccounts()).deployer);
    player = await ethers.getSigner((await getNamedAccounts()).player);
    det = await ethers.getContract("DoubleEntryPoint");
    vault = await ethers.getContract("CryptoVault");
  });

  it("should set up a detection bot", async () => {
    await deployments.deploy("DetectionBot", {
      from: player.address,
      args: [vault.address],
      log: true,
    });
    const bot = await ethers.getContract("DetectionBot");
    const forta: Forta = await ethers.getContract("Forta");
    await forta.connect(player).setDetectionBot(bot.address);
  });

  it("should allow sweep other token", async () => {
    await deployments.deploy("ERC20Mock", {
      from: player.address,
      args: [vault.address],
      log: true,
    });
    const mock: IERC20 = await ethers.getContract("ERC20Mock");
    expect(await mock.balanceOf(vault.address)).to.be.gt(0);
    await vault.sweepToken(mock.address);
    expect(await mock.balanceOf(vault.address)).to.be.equal(0);
  });

  it("should not allow sweep DET token", async () => {
    console.log("value", vault.address);
    await expect(
      vault.sweepToken(await det.delegatedFrom())
    ).to.be.revertedWith("Alert has been triggered, reverting");
  });
});
