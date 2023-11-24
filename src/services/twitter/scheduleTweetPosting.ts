import sleep from "../../util/sleep";
import generateTweetContent from "../openai/generateTweetContent";
import {
  getRandomFavoritedNotTweetedImage,
  updateImage,
} from "../prisma-crud/image";
import postTweetWithImage from "./postTweetWithImage";

/**
 * Continuously schedules and posts tweets at random intervals within the specified range.
 *
 * @param baseIntervalHours - The base interval in hours for posting tweets.
 * @param variationMinutes - The variation in minutes by which the posting time can randomly change.
 */
export default async (
  baseIntervalHours: number,
  variationMinutes: number,
): Promise<void> => {
  const baseIntervalMilliseconds = baseIntervalHours * 3600000;
  const variationMilliseconds = variationMinutes * 60000;

  while (true) {
    try {
      const randomDelay =
        Math.random() * (2 * variationMilliseconds) - variationMilliseconds; // Random delay between -variationMinutes to +variationMinutes
      const delay = baseIntervalMilliseconds + randomDelay;

      const image = await getRandomFavoritedNotTweetedImage();
      if (image == null) {
        throw new Error("No image to tweet");
      }

      // Generate the tweet content with GPT
      const tweetContent = await generateTweetContent(
        image.generationInfo.prompt,
      );

      await postTweetWithImage(tweetContent, image.path);
      console.log("Tweet posted successfully");

      // Mark the image as tweeted
      await updateImage(image.id, { isTweeted: true });

      // Wait for the next interval
      await sleep(delay);
    } catch (error: any) {
      console.log("Error in posting tweet:", error.message);
      // Even if there's an error, continue to the next iteration after the delay
      await sleep(baseIntervalMilliseconds);
    }
  }
};
