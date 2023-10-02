import { type User } from "@prisma/client";
import passport from "passport";
import { Strategy } from "passport-jwt";
import { getUserById } from "../prisma-crud/user";
import { type Request } from "express";

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

export default (): void => {
  passport.use(
    new Strategy(options, (jwtPayload: JwtPayload, done) => {
      void (async () => {
        const user: User | null = await getUserById(jwtPayload.id);
        if (user != null) {
          done(null, user);
          return;
        }
        done(null, false);
      })();
    })
  );
};
