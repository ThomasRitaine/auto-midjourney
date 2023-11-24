import { TwitterApi, type TwitterApiv1 } from "twitter-api-v2";
import { getAdminUser } from "../prisma-crud/user";

export default async (): Promise<TwitterApiv1> => {
  // Get the access token and secret from the database
  const adminUser = await getAdminUser();
  if (adminUser == null) {
    throw new Error("Admin user not found.");
  }
  const accessToken = adminUser.twitterOAuth1AccessToken as string;
  const accessSecret = adminUser.twitterOAuth1AccessSecret as string;

  // Initialize Twitter API client
  const userOAuth1Client = new TwitterApi({
    appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
    appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
    accessToken,
    accessSecret,
  }).v1;

  return userOAuth1Client;
};
