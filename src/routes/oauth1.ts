import express, { type Response, type Request } from "express";
import { TwitterApi } from "twitter-api-v2";
import oAuthCallbackUrl from "../services/twitter/oAuthCallbackUrl";
import { getAdminUser, updateUser } from "../services/prisma-crud/user";

const router = express.Router();

// Define the OAuth1 callback URL
const callbackUrl = oAuthCallbackUrl(1);

/**
 * Initiates Twitter OAuth1 authentication.
 * @route GET /oauth1/twitter
 * @description Redirects the user to Twitter for authentication. It generates an OAuth1 authorization link.
 *              It also sets necessary cookies for `oauthToken` and `oauthSecret` for later validation.
 * @returns {Response} Redirects the user to the Twitter authentication page.
 */
router.get("/twitter", (req: Request, res: Response) => {
  void (async () => {
    const requestClient = new TwitterApi({
      appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
      appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
    });

    const authLink = await requestClient.generateAuthLink(callbackUrl);

    // Store the oauthToken and oauthSecret in cookies with a 1-hour expiry
    res.cookie("oauthToken", authLink.oauth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1 * 3600000),
    });
    res.cookie("oauthSecret", authLink.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1 * 3600000),
    });

    // Redirect the user to Twitter authentication page
    res.redirect(authLink.url);
  })();
});

/**
 * Handles the callback from Twitter OAuth1 authentication.
 * @route GET /oauth1/twitter/callback
 * @description Handles the callback from Twitter after the user authorizes the application.
 *              It validates the `oauthToken` and `oauthVerifier` returned from Twitter against the stored `oauthToken` and `oauthSecret`.
 *              If valid, it exchanges the tokens for access tokens and updates these tokens in the admin user's record.
 * @returns {Response} A response indicating the outcome of the authentication process.
 */
router.get("/twitter/callback", (req: Request, res: Response) => {
  void (async () => {
    // Validate the presence of required query parameters
    if (
      req.query.oauth_token === undefined ||
      req.query.oauth_verifier === undefined
    ) {
      res.status(400).render("error", {
        error:
          "Bad request, or you denied application access. Please renew your request.",
      });
      return;
    }

    // Extract oauthToken and oauthVerifier from the query string
    const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } =
      req.query;
    // Retrieve the saved oauthToken and oauthSecret from cookies
    const { oauthToken: savedToken, oauthSecret: savedSecret } = req.cookies;

    // Validate the oauthToken and compare with the saved one
    if (
      savedToken == null ||
      savedSecret == null ||
      savedToken !== oauthToken
    ) {
      res.status(400).render("error", {
        error:
          "OAuth token is not known or invalid. Your request may have expired. Please renew the auth process.",
      });
      return;
    }

    // Create a temporary client to exchange tokens for access tokens
    const tempClient = new TwitterApi({
      appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
      appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
      accessToken: oauthToken as string,
      accessSecret: savedSecret as string,
    });

    // Exchange the oauthVerifier for access tokens
    const { accessToken, accessSecret } = await tempClient.login(
      oauthVerifier as string,
    );

    // Update the access tokens in the admin user's record in the database
    const adminUser = await getAdminUser();
    if (adminUser == null) {
      return res.status(500).send("Admin user not found.");
    }
    await updateUser(adminUser.id, {
      twitterOAuth1AccessToken: accessToken,
      twitterOAuth1AccessSecret: accessSecret,
    });
  })();
});

export default router;
