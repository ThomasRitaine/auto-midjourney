import { TwitterApi, type TwitterApiv1 } from "twitter-api-v2";
import { getAdminUser } from "../prisma-crud/user";

/**
 * Creates and initializes a Twitter API client for OAuth 1.0.
 * @returns {Promise<TwitterApiv1>} A promise that resolves to an OAuth1 Twitter API client.
 * @throws {Error} Throws an error if the admin user or their Twitter OAuth1 credentials are not found.
 */
export default async (): Promise<TwitterApiv1> => {
  // Retrieve the admin user's OAuth1 access token and secret from the database
  const adminUser = await getAdminUser();
  if (adminUser == null) {
    throw new Error("Admin user not found.");
  }
  const accessToken = adminUser.twitterOAuth1AccessToken as string;
  const accessSecret = adminUser.twitterOAuth1AccessSecret as string;

  // Initialize and configure the Twitter API client with OAuth 1.0 credentials
  const userOAuth1Client = new TwitterApi({
    appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
    appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
    accessToken,
    accessSecret,
  }).v1; // Use the v1 version of the Twitter API

  return userOAuth1Client;
};
