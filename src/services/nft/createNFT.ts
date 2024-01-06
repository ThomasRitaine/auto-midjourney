import { type Image } from "@prisma/client";
import { mintNFT } from "./mintNFT";
import { uploadToIPFS } from "./uploadToIPFS";
import { updateImage } from "../prisma-crud/image";
import { listNFT } from "./listNFT";
import sleep from "../../util/sleep";

/**
 * Handles the entire process of creating an NFT for a given image.
 * It uploads the image and metadata to IPFS, mints the NFT, updates the database,
 * and finally lists the NFT on a marketplace.
 *
 * @param nftName - The name of the NFT.
 * @param nftDescription - A description for the NFT.
 * @param image - The image data to be used for the NFT.
 * @returns The tokenId of the minted NFT.
 */
export default async (
  nftName: string,
  nftDescription: string,
  image: Image,
): Promise<number> => {
  const ipfsUri = await uploadToIPFS(nftName, nftDescription, image);

  // Save the ipfsUri of the image to the database
  await updateImage(image.id, { ipfsUri });
  console.log("Image and metadata uploaded to IPFS");

  const tokenId = await mintNFT(ipfsUri);
  await updateImage(image.id, { tokenId: Number(tokenId) });
  console.log("NFT minted successfully");

  // Sleeps for 5 seconds to allow the NFT to be minted before listing it
  await sleep(5000);

  await listNFT(tokenId);
  console.log("NFT listed successfully");

  return tokenId;
};
