import { type Image } from "@prisma/client";
import { NFTStorage, File } from "nft.storage";
import sharp from "sharp";

/**
 * Uploads an image and its metadata to IPFS and returns the CID of the metadata.
 * The image is converted to JPG format before uploading, and metadata includes
 * the NFT's name, description, and image CID.
 * 
 * @param nftName - The name of the NFT.
 * @param nftDescription - A description of the NFT.
 * @param image - The image object including the path to the image file.
 * @returns The IPFS CID of the uploaded metadata as a string.
 */
export async function uploadToIPFS(
  nftName: string,
  nftDescription: string,
  image: Image,
): Promise<string> {
  // Initialize NFTStorage client with API key
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY as string,
  });

  // Convert the image to a JPG buffer
  const content = await sharp(image.path).jpeg().toArray();
  const imageFile = new File(content, `${image.id}.jpg`, { type: "image/jpg" });

  // Upload the image to IPFS and retrieve CID
  const imageCid = await client.storeBlob(imageFile);

  // Prepare and upload metadata including image reference
  const metadata = {
    name: nftName,
    description: nftDescription,
    image: `ipfs://${imageCid}`,
  };
  const metadataFile = new File(
    [JSON.stringify(metadata)],
    `${image.id}.json`,
    { type: "application/json" },
  );
  const nftMetadataCid = await client.storeBlob(metadataFile);

  // Return the CID of the metadata
  return `ipfs://${nftMetadataCid}`;
}
