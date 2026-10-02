const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("  PharmaChain — Smart Contract Deployment Script   ");
  console.log("==================================================");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance:        ${hre.ethers.formatEther(balance)} ETH`);

  const PharmaChain = await hre.ethers.getContractFactory("PharmaChain");
  const pharmaChain = await PharmaChain.deploy();
  await pharmaChain.waitForDeployment();

  const contractAddress = await pharmaChain.getAddress();
  console.log(`\n>>> PharmaChain deployed successfully to: ${contractAddress}`);

  // Retrieve artifact for ABI
  const artifact = await hre.artifacts.readArtifact("PharmaChain");

  const contractData = {
    address: contractAddress,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    abi: artifact.abi
  };

  // Sync to backend config
  const backendConfigDir = path.resolve(__dirname, "../../backend/config");
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }
  const backendFilePath = path.join(backendConfigDir, "contractData.json");
  fs.writeFileSync(backendFilePath, JSON.stringify(contractData, null, 2));
  console.log(`[Synced] Backend config written to:  ${backendFilePath}`);

  // Sync to frontend config
  const frontendConfigDir = path.resolve(__dirname, "../../frontend/src/config");
  if (!fs.existsSync(frontendConfigDir)) {
    fs.mkdirSync(frontendConfigDir, { recursive: true });
  }
  const frontendFilePath = path.join(frontendConfigDir, "contractData.json");
  fs.writeFileSync(frontendFilePath, JSON.stringify(contractData, null, 2));
  console.log(`[Synced] Frontend config written to: ${frontendFilePath}`);

  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
