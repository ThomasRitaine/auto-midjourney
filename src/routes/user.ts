import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserByResetPasswordToken,
  getUserByUsernameOrEmail,
  updateUser,
} from "../services/prisma-crud/user";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../services/auth/password";
import { signToken } from "../services/auth/jwt";

const router = express.Router();

/**
 * Login page route: Displays the login page to the user.
 * @route GET /user/login
 * @returns {Template} Renders the login template
 */
router.get("/login", (req: express.Request, res: express.Response) => {
  res.render("login");
});

/**
 * Login route: Authenticates the user based on username and password.
 * @route POST /user/login
 * @param {string} login    - The email or the username of the user
 * @param {string} password - The password of the user
 * @returns {Response} Redirects to /collection if successful, else returns an error message
 */
router.post("/login", (req: express.Request, res: express.Response) => {
  void (async () => {
    try {
      const user = await getUserByUsernameOrEmail(req.body.username ?? "");

      const isPasswordCorrect = await comparePassword(
        user?.password ?? "",
        req.body.password ?? ""
      );

      if (user == null || !isPasswordCorrect) {
        return res.status(400).json({
          message: "Invalid username or password.",
        });
      }

      const signedToken = await signToken({ id: user.id });

      res.cookie("accessToken", signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.redirect("/collection");
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Something has gone wrong please try again",
      });
    }
  })();
});

/**
 * Signup page route: Displays the registration page to the user.
 * @route GET /user/signup
 * @returns {Template} Renders the login template
 */
router.get("/signup", (req: express.Request, res: express.Response) => {
  res.render("signup");
});

/**
 * Signup route: Registers a new user.
 * @route POST /user/signup
 * @param {string} name - The full name of the user
 * @param {string} username - The desired username
 * @param {string} email - The email address
 * @param {string} password - The desired password
 * @returns {Object} Returns a success message if account creation was successful
 */
router.post("/signup", (req: express.Request, res: express.Response) => {
  void (async () => {
    try {
      const hashedPassword: any = await hashPassword(req.body.password);
      await createUser({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      return res.json({
        message: `${req.body.username} account has been created`,
      });
    } catch (error) {
      return res.json({
        error,
      });
    }
  })();
});

/**
 * Reset password request route: Sends a password reset token to the user's email.
 * @route POST /user/reset-password
 * @param {string} email - The email address associated with the account
 * @returns {Object} Returns information about the reset password token
 */
router.post(
  "/reset-password",
  (req: express.Request, res: express.Response) => {
    void (async () => {
      try {
        const tokenLifetimeMinute = 20;
        const user = await getUserByEmail(req.body.email ?? "");

        if (user == null) {
          return res.status(400).json({
            message: "Account does not exist.",
          });
        }

        const token = await generateToken(32);

        await updateUser(user.id, {
          resetPasswordToken: token,
          resetPasswordExpiration: new Date(
            Date.now() + tokenLifetimeMinute * 60000
          ).valueOf(),
        });

        // Added for development feedback
        return res.json({
          resetPasswordToken: token,
          resetPasswordExpiration: new Date(
            Date.now() + tokenLifetimeMinute * 60000
          ).valueOf(),
          tokenExpiresIn: `${tokenLifetimeMinute} minutes`,
          urlSentToEmail: `/reset-password/${token}`,
        });
      } catch (e) {
        return res.status(500).json({
          message: "Something went wrong please try again",
        });
      }
    })();
  }
);

/**
 * Password reset route: Allows a user to reset their password using a valid token.
 * @route POST /user/reset-password/:token
 * @param {string} token - The password reset token
 * @param {string} password - The new password
 * @returns {Object} Returns a success message if password reset was successful
 */
router.post(
  "/reset-password/:token",
  (req: express.Request, res: express.Response) => {
    void (async () => {
      try {
        const user = await getUserByResetPasswordToken(req.params.token ?? "");
        const isExpired =
          user?.resetPasswordExpiration != null
            ? new Date(user.resetPasswordExpiration) < new Date()
            : true;
        if (user == null || isExpired) {
          return res.status(400).json({
            message: "Invalid token. Token does not exist or is expired.",
          });
        }

        const hashedPassword = await hashPassword(req.body.password);
        await updateUser(user.id, {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiration: null,
        });

        res.status(200).send({
          success: true,
          message:
            "Password has been reset. Please login with your new password.",
        });
      } catch (e) {
        return res.status(500).json({
          message: "Something went wrong please try again",
        });
      }
    })();
  }
);

/**
 * Logout route: Ends the user's session.
 * @route GET /user/logout
 * @returns {Response} Redirects to the root (/) route
 */
router.get("/logout", (req: express.Request, res: express.Response) => {
  res.clearCookie("accessToken");
  res.redirect("/");
});

/**
 * Forbidden route: Displays a generic error message.
 * @route GET /user/forbidden
 * @returns {Object} Returns a generic error message
 */
router.get("/forbidden", (req: express.Request, res: express.Response) => {
  return res.json({
    message: "Please try again",
  });
});

export default router;
