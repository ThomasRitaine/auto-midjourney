import express, { type Response, type Request } from "express";
import { TwitterApi } from "twitter-api-v2";
import oAuthCallbackUrl from "../services/twitter/oAuthCallbackUrl";
import { getAdminUser, updateUser } from "../services/prisma-crud/user";

const router = express.Router();

// Define the OAuth2 callback URL
const callbackUrl = oAuthCallbackUrl(2);

/**
 * Initiates Twitter OAuth2 authentication.
 * @route GET /oauth2/twitter
 * @description Redirects the user to Twitter for authentication. It generates an OAuth2 authorization link with required scopes.
 *              It also sets necessary cookies for `codeVerifier` and `state` for later validation.
 * @returns {Response} Redirects the user to the Twitter authentication page.
 */
router.get("/twitter", (req: Request, res: Response) => {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
  });

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    callbackUrl,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] },
  );

  // Store the codeVerifier and state in cookies with a 1-hour expiry
  res.cookie("codeVerifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1 * 3600000),
  });
  res.cookie("state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1 * 3600000),
  });

  // Redirect the user to Twitter authentication page
  res.redirect(url);
});

/**
 * Handles the callback from Twitter OAuth2 authentication.
 * @route GET /oauth2/twitter/callback
 * @description Handles the callback from Twitter after the user authorizes the application.
 *              It validates the `state` and `code` returned from Twitter against the stored `codeVerifier` and `state`.
 *              If valid, it exchanges the code for a refresh token and updates this token in the admin user's record.
 * @returns {Response} A response indicating the outcome of the authentication process.
 */
router.get("/twitter/callback", (req: Request, res: Response) => {
  void (async () => {
    // Extract state and code from the query string
    const { state, code } = req.query;
    // Retrieve the saved codeVerifier and state from cookies
    const { codeVerifier, state: cookieState } = req.cookies;

    if (
      codeVerifier == null ||
      state == null ||
      cookieState == null ||
      code == null
    ) {
      return res
        .status(400)
        .send("You denied the app or your session expired.");
    }
    if (state !== cookieState) {
      return res.status(400).send("Stored tokens did not match.");
    }

    // Create a new Twitter API client instance
    const client = new TwitterApi({
      clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
    });

    // Exchange the code for a refresh token
    const { refreshToken } = await client.loginWithOAuth2({
      code: code as string,
      codeVerifier,
      redirectUri: callbackUrl,
    });

    // Update the admin user's refresh token in the database
    const adminUser = await getAdminUser();
    if (adminUser == null) {
      return res.status(500).send("Admin user not found.");
    }
    await updateUser(adminUser.id, {
      twitterOAuth2RefreshToken: refreshToken,
    });
  })();
});

export default router;
