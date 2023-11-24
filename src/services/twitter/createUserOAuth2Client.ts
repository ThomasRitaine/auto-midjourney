import { TwitterApi, type TwitterApiv2 } from "twitter-api-v2";
import { getAdminUser, updateUser } from "../prisma-crud/user";

export default async (): Promise<TwitterApiv2> => {
  // Initialize Twitter API client
  const appOAuth2Client = new TwitterApi({
    clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
  });

  // Get the refresh token from the database
  const adminUser = await getAdminUser();
  if (adminUser == null) {
    throw new Error("Admin user not found.");
  }
  const refreshToken = adminUser.twitterOAuth2RefreshToken;

  const { client: userOAuth2Client, refreshToken: newRefreshToken } =
    await appOAuth2Client.refreshOAuth2Token(refreshToken as string);

  // Update the refresh token in the database
  await updateUser(adminUser.id, {
    twitterOAuth2RefreshToken: newRefreshToken,
  });

  return userOAuth2Client.v2;
};
