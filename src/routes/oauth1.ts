import express, { type Response, type Request } from "express";
import { TwitterApi } from "twitter-api-v2";
import oAuthCallbackUrl from "../services/twitter/oAuthCallbackUrl";
import { getAdminUser, updateUser } from "../services/prisma-crud/user";

const router = express.Router();

const callbackUrl = oAuthCallbackUrl(1);

router.get("/twitter", (req: Request, res: Response) => {
  void (async () => {
    const requestClient = new TwitterApi({
      appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
      appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
    });

    const authLink = await requestClient.generateAuthLink(callbackUrl);

    // Put the oauthToken and oauthSecret in the cookies with 1 hour expiry
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

    // Redirect to auth link
    res.redirect(authLink.url);
  })();
});

router.get("/twitter/callback", (req: Request, res: Response) => {
  void (async () => {
    // Invalid request
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

    // Extract state and code from query string
    const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } =
      req.query;
    // Get the saved codeVerifier from session
    const { oauthToken: savedToken, oauthSecret: savedSecret } = req.cookies;

    if (
      savedToken == null ||
      savedSecret == null ||
      savedToken !== oauthToken
    ) {
      res.status(400).render("error", {
        error:
          "OAuth token is not known or invalid. Your request may have expire. Please renew the auth process.",
      });
      return;
    }

    // Build a temporary client to get access token
    const tempClient = new TwitterApi({
      appKey: process.env.TWITTER_OAUTH1_CONSUMER_API_KEY as string,
      appSecret: process.env.TWITTER_OAUTH1_CONSUMER_API_SECRET as string,
      accessToken: oauthToken as string,
      accessSecret: savedSecret as string,
    });

    // Ask for definitive access token
    const { accessToken, accessSecret } = await tempClient.login(
      oauthVerifier as string,
    );
    // You can store & use accessToken + accessSecret to create a new client and make API calls!

    // Update the refresh token in the database
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
