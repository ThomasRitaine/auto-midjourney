import { type User } from "@prisma/client";
import { type RequestHandler } from "express";
import passport from "passport";

/**
 * Middleware to authenticate a JWT token.
 * @param redirectIfNotAuthenticated - If true, redirects to login page when the user is not authenticated.
 * @returns {RequestHandler} Express middleware for JWT authentication.
 */
const authenticateJWT = (
  redirectIfNotAuthenticated: boolean,
): RequestHandler => {
  return (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: User | false, info: any) => {
        if (err != null) {
          next(err);
        }

        // If no user logged in
        if (user === false) {
          // The user is not logged in
          if (redirectIfNotAuthenticated) {
            res.redirect("/user/login");
          } else {
            req.user = false;
            next();
          }
        } else {
          // The user is logged in
          req.user = user;
          next();
        }
      },
    )(req, res, next);
  };
};

export default authenticateJWT;
