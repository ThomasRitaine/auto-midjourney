import { type Image } from "@prisma/client";
import postInstagramImage from "../instagram/postImage";
import postTweetWithImage from "../twitter/postTweetWithImage";
import { updateImage } from "../prisma-crud/image";
import generateContent from "../openai/generateContent";
import createNFT from "../nft/createNFT";

/**
 * Orchestrates publishing NFTs and related content to social media.
 * It utilizes image details and prompt to generate content, create NFTs,
 * and manage postings on Instagram and Twitter, updating the database post-action.
 *
 * @param image - Image with generation details and prompt for content creation.
 */
export default async (
  image: Image & { generationInfo: { prompt: string } },
): Promise<void> => {
  console.log(`NFT Social Media bot started for image ${image.id}`);

  // Generate the post content with GPT
  const generatedContent = await generateContent(
    image.generationInfo.prompt,
    image.createdAt,
  );
  if (generatedContent === undefined)
    throw new Error("Failed to generate content.");
  console.log("Content generated successfully");

  // Create, publish and list the NFT if not already created
  if (image.tokenId === null) {
    await createNFT(
      generatedContent.nftName,
      generatedContent.nftDescription,
      image,
    );
  }

  // Post on Instagram
  await postInstagramImage(generatedContent.post, image.path);
  console.log("Posted on Instagram successfully");

  // Post on Twitter
  await postTweetWithImage(generatedContent.post, image.path);
  console.log("Tweet posted successfully");

  // Mark the image as posted
  await updateImage(image.id, { isPosted: true });
};
