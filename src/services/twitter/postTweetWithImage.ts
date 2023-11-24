import createUserOAuth1Client from "./createUserOAuth1Client";
import createUserOAuth2Client from "./createUserOAuth2Client";

/**
 * Posts a tweet with an attached image.
 *
 * @param tweetContent - The content of the tweet.
 * @param imagePath - The path of the image to be attached to the tweet.
 * @throws Throws an error if the Twitter API call fails.
 */
export default async (
  tweetContent: string,
  imagePath: string,
): Promise<void> => {
  try {
    // Get the user OAuth1 and OAuth2 clients
    const userOAuth1Client = await createUserOAuth1Client();
    const userOAuth2Client = await createUserOAuth2Client();

    // Upload the image to Twitter
    const mediaId = await userOAuth1Client.uploadMedia(imagePath);

    await userOAuth2Client.tweet(tweetContent, {
      media: { media_ids: [mediaId] },
    });
  } catch (error) {
    console.error("Error in posting tweet:", error);
    throw error;
  }
};
