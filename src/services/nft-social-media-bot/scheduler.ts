import sleep from "../../util/sleep";
import { getRandomFavoritedNotTweetedImage } from "../prisma-crud/image";
import nftPostBot from "./bot";

/**
 * Continuously schedules and posts on social medias at random intervals within the specified range.
 *
 * @param baseIntervalMinutes - The base interval in minutes for posting tweets.
 * @param variationMinutes - The variation in minutes by which the posting time can randomly change.
 */
export default async (
  baseIntervalMinutes: number,
  variationMinutes: number,
): Promise<void> => {
  const baseIntervalMilliseconds = baseIntervalMinutes * 60000;
  const variationMilliseconds = variationMinutes * 60000;

  while (true) {
    try {
      const randomDelay =
        Math.random() * (2 * variationMilliseconds) - variationMilliseconds; // Random delay between -variationMinutes to +variationMinutes
      const delay = baseIntervalMilliseconds + randomDelay;

      const image = await getRandomFavoritedNotTweetedImage();
      if (image == null) {
        throw new Error("No image to post");
      }

      await nftPostBot(image);

      // Wait for the next interval
      await sleep(delay);
    } catch (error: any) {
      console.log("Error in scheduler:", error.message);
      // Even if there's an error, continue to the next iteration after the delay
      await sleep(baseIntervalMilliseconds);
    }
  }
};
