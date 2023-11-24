import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import generateRouter from "./routes/generate";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import collectionRouter from "./routes/collection";
import imageRouter from "./routes/image";
import userRouter from "./routes/user";
import oauth1Router from "./routes/oauth1";
import oauth2Router from "./routes/oauth2";
import adminFavouriteRouter from "./routes/admin/favourite";
import { getRandomPublicImage } from "./services/prisma-crud/image";
import passport from "passport";
import passportConfig from "./services/auth/passport";
import scheduleTweetPosting from "./services/twitter/scheduleTweetPosting";

const app = express();
const port = 3000;

// Passport config
passportConfig();

// Express config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser.default());
app.use(cors.default());
app.use(passport.initialize());

// Static files
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/image", express.static(path.join(__dirname, "..", "image")));

// Home page
app.get("/", (req: Request, res: Response) => {
  void (async () => {
    const randomImage = await getRandomPublicImage();
    res.render("homepage", { image: randomImage });
  })();
});

// Import Routers
app.use("/generate", generateRouter);
app.use("/collection", collectionRouter);
app.use("/image", imageRouter);
app.use("/user", userRouter);
app.use("/oauth1", oauth1Router);
app.use("/oauth2", oauth2Router);

// Admin Routers
app.use(adminFavouriteRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// Start the Twitter bot, scheduling tweets every X hours with a variation of Y minutes
void scheduleTweetPosting(
  process.env.TWITTER_TWEET_INTERVAL_HOURS as unknown as number,
  process.env.TWITTER_TWEET_VARIATION_MINUTES as unknown as number,
);
