import express from "express";
import bodyParser from "body-parser";
import generateAndDownload from "./midjourney/generateAndDownload";
import path from "path";
import {
  createCollection,
  getCollectionByName,
  getAllCollections,
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
} from "./services/prisma-crud/collection";
import {
  deleteImage,
  getImagesByCollectionId,
} from "./services/prisma-crud/image";
import { type Collection, type GenerationInfo } from "@prisma/client";
import { createGenerationInfo } from "./services/prisma-crud/generationInfo";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/image", express.static(path.join(__dirname, "..", "image")));

app.get("/", (req, res) => {
  res.render("generate");
});

app.post("/generate", async (req, res) => {
  const prompts = Array.isArray(req.body.prompt)
    ? req.body.prompt
    : [req.body.prompt];
  const repeats = Array.isArray(req.body.repeat)
    ? req.body.repeat
    : [req.body.repeat];
  const collectionsName = Array.isArray(req.body.collection)
    ? req.body.collection
    : [req.body.collection];

  const collections: Collection[] = [];

  for (const collectionName of collectionsName) {
    let collection = await getCollectionByName(collectionName);
    if (!collection) {
      collection = await createCollection(collectionName);
    }
    collections.push(collection);
  }

  const generationInfoGroup: GenerationInfo[] = [];

  for (let index = 0; index < prompts.length; index++) {
    const prompt = prompts[index];
    const generationInfo = await createGenerationInfo({
      prompt,
      repeat: parseInt(repeats[index]),
      collection: {
        connect: {
          id: collections[index].id,
        },
      },
    });
    generationInfoGroup.push(generationInfo);
  }

  generateAndDownload(generationInfoGroup);

  const isCollectionUnique = generationInfoGroup.every(
    (item) => item.id === generationInfoGroup[0].id
  );

  generationInfoGroup.forEach((generationInfo) => {
    console.log(`Generating id : ${generationInfo.id}`);
  });

  if (generationInfoGroup.length === 1 || isCollectionUnique) {
    res.redirect(`/collection/${collections[0].slug}`);
  } else {
    res.redirect("/collection");
  }
});

app.get("/collection", async (req, res) => {
  const collections = await getAllCollections();

  // Get the number of image in each collection
  const numberImagesInCollection: Record<string, number> = {};
  for (const collection of collections) {
    numberImagesInCollection[collection.id] = await getNumberImageOfCollection(
      collection.id
    );
  }

  // Get the first image of each collection
  const firstImageOfCollection: Record<string, string | null> = {};
  for (const collection of collections) {
    const image = await getFirstImagesOfCollectionId(collection.id);
    firstImageOfCollection[collection.id] = image ? image.path : null;
  }

  res.render("collections", {
    collections,
    numberImagesInCollection,
    firstImageOfCollection,
  });
});

app.get("/collection/:slug", async (req, res) => {
  const { slug } = req.params;
  const collection = await getCollectionBySlug(slug);

  // return 404 if the collection doesn't exist
  if (!collection) {
    res.status(404).send("Collection not found");
    return;
  }

  const images = await getImagesByCollectionId(collection.id);

  res.render("collection", { images, collection: collection.name });
});

app.delete("/image/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteImage(id);
    res.status(200).send({
      success: true,
      message: `Image ${id} deleted successfully.`,
    });
  } catch (error) {
    res.status(404).send({ success: false, message: "Image not found." });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
