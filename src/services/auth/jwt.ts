import jwt from "jsonwebtoken";
import type express from "express";

/**
 * Middleware function to verify the authenticity of a JWT token.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The Express next middleware function.
 *
 * @example
 * app.use("/secured-route", verify, (req, res) => {
 *   // secured logic
 * });
 */
export const verify = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const decoded = jwt.verify(
      req.cookies.accessToken,
      process.env.jwtSecret as string
    );
    if (decoded === "") {
      res.redirect(403, "/login");
    }
    next();
  } catch (err) {
    res.redirect(403, "/login");
  }
};

/**
 * Sign a new JWT token for authenticated users.
 *
 * @returns A signed JWT token.
 *
 * @example
 * const token = await sign({ id: user.id});
 * res.cookie("accessToken", token);
 */
export const signToken = async (payload: any): Promise<string> => {
  const signed = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30s",
  });
  return signed;
};

/**
 * Sign a JWT token specifically for password reset actions.
 *
 * @returns A signed JWT token for password reset.
 *
 * @example
 * const resetToken = await resetpass();
 * sendEmail(user.email, resetToken);
 */
export const resetpass = async (): Promise<string> => {
  const signed = jwt.sign(
    {
      type: "appUser",
      action: "reset",
    },
    process.env.jwtSecret as string,
    {
      expiresIn: "5m",
    }
  );
  return signed;
};
