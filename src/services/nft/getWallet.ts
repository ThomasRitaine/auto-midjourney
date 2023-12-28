import { type Wallet, ethers } from "ethers";

/**
 * Initializes and returns an Ethereum wallet using Infura as the provider and
 * the private key from environment variables.
 * Throws an error if the environment isn't properly configured.
 *
 * @returns {Wallet} A Wallet instance connected to the Ethereum network.
 */
function getWallet(): Wallet {
  // Ensure the environment variables are set
  if (
    process.env.INFURA_PRIVATE_ENDPOINT == null ||
    process.env.METAMASK_WALLET_PRIVATE_KEY == null
  ) {
    throw new Error(
      "Please set the INFURA_PRIVATE_ENDPOINT and METAMASK_WALLET_PRIVATE_KEY environment variables.",
    );
  }

  // Initialize the provider with the Infura endpoint
  const provider = new ethers.JsonRpcProvider(
    process.env.INFURA_PRIVATE_ENDPOINT,
  );

  // Create a new wallet instance with the private key and provider
  const wallet = new ethers.Wallet(
    process.env.METAMASK_WALLET_PRIVATE_KEY,
    provider,
  );

  return wallet;
}

export default getWallet;
