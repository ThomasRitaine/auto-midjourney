import { PrismaClient } from "@prisma/client";
import generateContent from "../openai/generateContent";
import createNFT from "../nft/createNFT";
import sleep from "../../util/sleep";

/**
 * Processes previously posted images to generate and list NFTs retrospectively.
 * It fetches all posted images without associated NFTs and sequentially generates content,
 * creates NFTs, and updates the database. Includes delays to manage load and ensure service stability.
 */
export default async (): Promise<void> => {
  const prisma = new PrismaClient();

  const images = await prisma.image.findMany({
    where: {
      isPosted: true,
      tokenId: null,
    },
    include: {
      generationInfo: {
        select: {
          prompt: true,
        },
      },
    },
  });

  // syncronous for loop with a try catch block and a delay, shuffle the images array to randomize the order
  images.sort(() => Math.random() - 0.5);
  for (const image of images) {
    try {
      console.log(`Catch up NFT bot started for image ${image.id}`);

      // Generate the post content with GPT
      const generatedContent = await generateContent(
        image.generationInfo.prompt,
        image.createdAt,
      );
      if (generatedContent === undefined)
        throw new Error("Failed to generate content.");
      console.log(`Content generated successfully for image ${image.id}`);

      // Create, publish and list the NFT
      await createNFT(
        generatedContent.nftName,
        generatedContent.nftDescription,
        image,
      );
      console.log(`NFT created for image ${image.id}`);
    } catch (error: any) {
      console.log(`Error creating NFT for image ${image.id}: ${error.message}`);
    }
    await sleep(300000); // Sleeps for 5 minutes
  }
};
