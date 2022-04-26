import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import {
  CryptoVault,
  DoubleEntryPoint,
  Forta,
  LegacyToken,
} from "../typechain";

const deployCryptoVault: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer, player } = await getNamedAccounts();

  await deploy("LegacyToken", {
    from: deployer,
    args: [],
    log: true,
  });
  const lgt: LegacyToken = await ethers.getContract("LegacyToken");

  await deploy("Forta", {
    from: deployer,
    args: [],
    log: true,
  });
  const forta: Forta = await ethers.getContract("Forta");

  await deploy("CryptoVault", {
    from: deployer,
    args: [deployer],
    log: true,
  });
  const vault: CryptoVault = await ethers.getContract("CryptoVault");

  await deploy("DoubleEntryPoint", {
    from: deployer,
    args: [lgt.address, vault.address, forta.address, player],
    log: true,
  });
  const det: DoubleEntryPoint = await ethers.getContract("DoubleEntryPoint");

  await vault.setUnderlying(det.address);
  await lgt.delegateToNewContract(det.address);
  await lgt.mint(vault.address, ethers.utils.parseEther("100"));
};

export default deployCryptoVault;
deployCryptoVault.tags = ["CryptoVault"];
deployCryptoVault.dependencies = [];
