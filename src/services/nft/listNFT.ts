import { OpenSeaSDK, Chain } from "opensea-js";
import getWallet from "./getWallet";

/**
 * Lists an NFT on the OpenSea marketplace using the provided tokenId.
 * Assumes environment variables for contract and wallet addresses, and OpenSea API key are set.
 *
 * @param tokenId - The token ID of the NFT to list.
 */
export async function listNFT(tokenId: number): Promise<void> {
  const wallet = getWallet();

  // Initialize OpenSea SDK client with the wallet and Polygon chain
  const openseaClient = new OpenSeaSDK(wallet, {
    chain: Chain.Polygon,
    apiKey: process.env.OPENSEA_API_KEY,
  });

  // Retrieve necessary contract and wallet addresses from environment variables
  const contractAddress = process.env.CONTRACT_ADDRESS as string;
  const walletAddress = process.env.METAMASK_WALLET_ADDRESS as string;

  // Set listing expiration to 30 days from now
  const daysUntilExpiration = 30;
  const expirationTime =
    Math.floor(Date.now() / 1000) + daysUntilExpiration * 24 * 60 * 60;

  // Create listing on OpenSea with the specified parameters
  await openseaClient.createListing({
    asset: {
      tokenId: tokenId.toString(),
      tokenAddress: contractAddress,
    },
    accountAddress: walletAddress,
    startAmount: 109, // 109 MATIC = 100€ at the time of writing
    expirationTime,
  });
}
