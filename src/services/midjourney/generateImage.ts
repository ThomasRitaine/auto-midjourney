import { type MJMessage, type Midjourney } from "midjourney";
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

  const upscalingTimeout = 180000; // 3 minutes in milliseconds
  const generatingTimeout = 180000; // 3 minutes in milliseconds
  const maxRetries = 3;

  for (let i = 0; i < generationInfo.repeat; i++) {
    // Set the client in the right speed mode
    if (generationInfo.speed === "FAST") {
      await client.Fast();
    } else {
      await client.Relax();
    }

    // Sleep to avoid rate limiting
    await sleep(1500);

    let imagineMJMessage;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        imagineMJMessage = await Promise.race([
          client.Imagine(
            generationInfo.prompt,
            (uri: string, progress: string) => {
              console.log("progress", progress);
            },
          ),
          new Promise((_resolve, reject) =>
            setTimeout(() => {
              reject(new Error("Image generation timed out"));
            }, generatingTimeout),
          ),
        ]);
        if (imagineMJMessage !== null && imagineMJMessage !== undefined) break; // Exit loop if message is successfully received
      } catch (error) {
        console.log(
          `Attempt ${attempt + 1} failed: ${(error as Error).toString()}`,
        );
        if (attempt >= maxRetries) throw error; // Rethrow error on last attempt
      }
    }

    if (imagineMJMessage == null) {
      console.log("No message upon generation end");
      return images;
    }

    // Attempt to upscale images with retries and timeout
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const upscaledResults = await Promise.race([
          upscaleImages(client, imagineMJMessage as MJMessage),
          new Promise((_resolve, reject) =>
            setTimeout(() => {
              reject(new Error("Upscaling timed out"));
            }, upscalingTimeout),
          ),
        ]);

        // Throw error if upscaledResults is not an array
        if (!Array.isArray(upscaledResults)) {
          throw new Error("Upscaled results is not an array");
        }

        const uriList = upscaledResults.map((item) => item.uri);
        for (const uri of uriList) {
          await sleep(1000); // Sleep to avoid rate limiting
          images.push(await createImageByUri(uri, generationInfo));
        }

        break; // break the loop if successful
      } catch (error) {
        console.log(
          `Attempt ${attempt + 1} failed: ${(error as Error).toString()}`,
        );
        if (attempt >= maxRetries) throw error; // Rethrow error on last attempt
      }
    }

    // Update the updatedAt field of the Collection
    await updateCollection(generationInfo.collectionId ?? "", {});
  }

  return images;
}

export default generateImage;
