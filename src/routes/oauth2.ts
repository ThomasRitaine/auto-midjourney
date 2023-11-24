import express, { type Response, type Request } from "express";
import { TwitterApi } from "twitter-api-v2";
import oAuthCallbackUrl from "../services/twitter/oAuthCallbackUrl";
import { getAdminUser, updateUser } from "../services/prisma-crud/user";

const router = express.Router();

const callbackUrl = oAuthCallbackUrl(2);

router.get("/twitter", (req: Request, res: Response) => {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
    clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
  });

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    callbackUrl,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] },
  );

  // Put the codeVerifier and state in the cookies with 1 hour expiry
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

  // Redirect to auth link
  res.redirect(url);
});

router.get("/twitter/callback", (req: Request, res: Response) => {
  void (async () => {
    // Extract state and code from query string
    const { state, code } = req.query;
    // Get the saved codeVerifier from session
    const { codeVerifier, state: cookieState } = req.cookies;

    if (
      codeVerifier == null ||
      state == null ||
      cookieState == null ||
      code == null
    ) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }
    if (state !== cookieState) {
      return res.status(400).send("Stored tokens didnt match!");
    }

    // Obtain access token
    const client = new TwitterApi({
      clientId: process.env.TWITTER_OAUTH2_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_OAUTH2_CLIENT_SECRET as string,
    });

    const { refreshToken } = await client.loginWithOAuth2({
      code: code as string,
      codeVerifier,
      redirectUri: callbackUrl,
    });

    // Update the refresh token in the database
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
