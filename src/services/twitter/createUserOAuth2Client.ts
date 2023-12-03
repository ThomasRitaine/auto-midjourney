import { TwitterApi, type TwitterApiv2 } from "twitter-api-v2";
import { getAdminUser, updateUser } from "../prisma-crud/user";

/**
 * Creates and initializes a Twitter API client for OAuth 2.0.
 * @returns {Promise<TwitterApiv2>} A promise that resolves to an OAuth2 Twitter API client.
 * @throws {Error} Throws an error if the admin user or their Twitter OAuth2 credentials are not found.
 */
export default async (): Promise<TwitterApiv2> => {
  // Initialize Twitter API client with OAuth 2.0 app credentials
  const appOAuth2Client = new TwitterApi({
    clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
  });

  // Retrieve the admin user's OAuth2 refresh token from the database
  const adminUser = await getAdminUser();
  if (adminUser == null) {
    throw new Error("Admin user not found.");
  }
  const refreshToken = adminUser.twitterOAuth2RefreshToken;

  // Refresh the OAuth2 token using the existing refresh token
  const { client: userOAuth2Client, refreshToken: newRefreshToken } =
    await appOAuth2Client.refreshOAuth2Token(refreshToken as string);

  // Update the new refresh token in the database for future use
  await updateUser(adminUser.id, {
    twitterOAuth2RefreshToken: newRefreshToken,
  });

  // Return the OAuth2 client configured for user-specific operations
  return userOAuth2Client.v2;
};
