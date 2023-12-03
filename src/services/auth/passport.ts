import { type User } from "@prisma/client";
import passport from "passport";
import { Strategy } from "passport-jwt";
import { getUserById, updateLastLoginUser } from "../prisma-crud/user";
import { type Request } from "express";

/**
 * Extracts the JWT token from the request cookies.
 *
 * @param req - The Express request object.
 * @returns The JWT token if present, otherwise null.
 */
const cookieExtractor = (req: Request): string | null => {
  let jwt = null;
  if (req == null) {
    return null;
  }
  if (req.cookies != null) {
    jwt = req.cookies.accessToken;
  }
  return jwt;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

interface JwtPayload {
  id: string;
}

/**
 * Configures the passport JWT strategy.
 *
 * This function sets up passport to use a JWT strategy for authentication. It defines how the JWT token is extracted
 * from incoming requests and how the user is loaded based on the JWT payload. If the user exists, it updates their last login
 * and completes the authentication process.
 */
export default (): void => {
  passport.use(
    new Strategy(options, (jwtPayload: JwtPayload, done) => {
      void (async () => {
        // Fetch the user by the ID in the JWT payload
        const user: User | null = await getUserById(jwtPayload.id);

        // If user exists, update last login and authenticate
        if (user != null) {
          await updateLastLoginUser(user.id);
          done(null, user);
          return;
        }

        // If user does not exist, authentication fails
        done(null, false);
      })();
    }),
  );
};
