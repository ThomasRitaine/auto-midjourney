import { type Midjourney } from "midjourney";
import upscaleImages from "./upscaleImages";
import { type GenerationInfo, type Image } from "@prisma/client";
import { createImageByUri } from "../prisma-crud/image";
import { updateCollection } from "../prisma-crud/collection";
import sleep from "../../util/sleep";

/**
 * Generates images using the Midjourney client based on the specified generation information.
 * @param {Midjourney} client - The Midjourney client instance.
 * @param {GenerationInfo} generationInfo - The information for generating images.
 * @returns {Promise<Image[]>} An array of generated images.
 */
async function generateImage(
  client: Midjourney,
  generationInfo: GenerationInfo,
): Promise<Image[]> {
  const images: Image[] = [];

  for (let i = 0; i < generationInfo.repeat; i++) {
    // Set the client in the right speed mode
    if (generationInfo.speed === "FAST") {
      await client.Fast();
    } else {
      await client.Relax();
    }

    // Sleep to avoid rate limiting
    await sleep(1500);

    // Generate the image using Midjourney client
    const imagineMJMessage = await client.Imagine(
      generationInfo.prompt,
      (uri: string, progress: string) => {
        console.log("progress", progress);
      },
    );

    if (imagineMJMessage == null) {
      console.log("No message upon generation end");
      return images;
    }

    const upscaledResults = await upscaleImages(client, imagineMJMessage);

    const uriList = upscaledResults.map((item) => {
      return item.uri;
    });

    for (const uri of uriList) {
      // Sleep to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      images.push(await createImageByUri(uri, generationInfo));
    }
    // Update the updatedAt field of the Collection
    await updateCollection(generationInfo.collectionId ?? "", {});
  }

  return images;
}

export default generateImage;
