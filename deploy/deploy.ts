import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

import { Hacker } from "../typechain";

const deployOndoDistributor: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Hacker", {
    from: deployer,
    args: [],
    log: true,
  });

  const hacker = await ethers.getContract("Hacker");
};

export default deployOndoDistributor;
deployOndoDistributor.tags = ["Hacker"];
deployOndoDistributor.dependencies = [];
