import express from "express";
import bodyParser from "body-parser";
import path from "path";
import generateRouter from "./routes/generate";
import collectionRouter from "./routes/collection";
import imageRouter from "./routes/image";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/image", express.static(path.join(__dirname, "..", "image")));

// Import Routers
app.use("/generate", generateRouter);
app.use("/collection", collectionRouter);
app.use("/image", imageRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
