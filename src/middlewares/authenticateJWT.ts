import { type User } from "@prisma/client";
import { type RequestHandler } from "express";
import passport from "passport";

const authenticateJWT: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: User | false, info: any) => {
      if (err != null) {
        next(err);
      }

      // If authentication fails, redirect to login
      if (user === false) {
        res.redirect("/user/login");
      }

      // If authentication succeeds, continue
      req.user = user;
      next();
    }
  )(req, res, next);
};

export default authenticateJWT;
