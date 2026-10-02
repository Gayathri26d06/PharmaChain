const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

let contractData = null;
const contractDataPath = path.join(__dirname, "contractData.json");

try {
  if (fs.existsSync(contractDataPath)) {
    contractData = JSON.parse(fs.readFileSync(contractDataPath, "utf8"));
  }
} catch (err) {
  console.warn("[Blockchain Config] Unable to load contractData.json, using defaults.");
}

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || (contractData && contractData.address) || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = (contractData && contractData.abi) || [];

let provider = null;
let signer = null;

const getProvider = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
  }
  return provider;
};

const getSigner = () => {
  if (!signer) {
    const prov = getProvider();
    signer = new ethers.Wallet(PRIVATE_KEY, prov);
  }
  return signer;
};

const getContract = (withSigner = false) => {
  if (withSigner) {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, getSigner());
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, getProvider());
};

module.exports = {
  RPC_URL,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  getProvider,
  getSigner,
  getContract
};
