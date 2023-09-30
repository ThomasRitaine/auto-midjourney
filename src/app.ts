import express from "express";
import bodyParser from "body-parser";
import path from "path";
import generateRouter from "./routes/generate";
import collectionRouter from "./routes/collection";
import imageRouter from "./routes/image";
import { getRandomImage } from "./services/prisma-crud/image";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/image", express.static(path.join(__dirname, "..", "image")));

// Home page
app.get("/", (req, res) => {
  void (async () => {
    const randomImage = await getRandomImage();
    res.render("homepage", { image: randomImage });
  })();
});

// Import Routers
app.use("/generate", generateRouter);
app.use("/collection", collectionRouter);
app.use("/image", imageRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
