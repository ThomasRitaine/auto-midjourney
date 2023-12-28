import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";
import getWallet from "./getWallet";

/**
 * Mints an NFT with a given IPFS URI and retrieves its token ID.
 * Assumes the smart contract ABI and address are correctly provided via environment variables.
 * 
 * @param ipfsUri - The URI of the NFT metadata stored on IPFS.
 * @returns The token ID of the minted NFT as a number.
 */
export async function mintNFT(ipfsUri: string): Promise<number> {
  const wallet = getWallet();

  // Retrieve contract address and ABI from the environment and file system respectively
  const contractAddress = process.env.CONTRACT_ADDRESS as string;
  const contractABIPath = path.join(__dirname, "contractABI.json");
  const contractABI = JSON.parse(readFileSync(contractABIPath, "utf8"));

  // Instantiate contract with ABI, address, and wallet
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Mint the NFT and wait for the transaction to be mined
  const transaction = await contract.safeMint(
    process.env.METAMASK_WALLET_ADDRESS,
    ipfsUri,
  );
  const receipt = await transaction.wait();

  // Initialize tokenId and parse logs to extract tokenId from minting event
  let tokenId: number = -1;
  const iface = new ethers.Interface(contractABI);
  receipt.logs.forEach((log: { topics: string[]; data: string }) => {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog !== null && parsedLog.name === "TokenMinted") {
        tokenId = parsedLog.args.tokenId.toString();
      }
    } catch (error) {
      // Ignoring logs not relevant to TokenMinted event
    }
  });

  return tokenId;
}
