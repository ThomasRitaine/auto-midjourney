import express from "express";
import bodyParser from "body-parser";
import generateAndDownload from "./midjourney/generateAndDownload";
import path from "path";
import {
  createCollection,
  getAllCollections,
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
  getCollectionByNameOrSlug,
} from "./services/prisma-crud/collection";
import {
  deleteImage,
  getImagesWithPromptByCollectionId,
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

app.post("/generate", (req, res) => {
  void (async () => {
    const userToken: string = req.body.token;

    if (userToken !== process.env.GENERATION_TOKEN) {
      res.status(403).send("Invalid token.");
      return;
    }

    const prompts = Array.isArray(req.body.prompt)
      ? req.body.prompt
      : [req.body.prompt];

    const repeats = Array.isArray(req.body.repeat)
      ? req.body.repeat
      : [req.body.repeat];

    const collectionsName = Array.isArray(req.body.collection)
      ? req.body.collection
      : [req.body.collection];

    const defaultCollection: string = req.body.defaultCollection;

    const collections: Collection[] = [];

    for (let collectionName of collectionsName) {
      collectionName =
        collectionName === "" ? defaultCollection : collectionName;

      let collection = await getCollectionByNameOrSlug(collectionName);
      if (collection == null) {
        try {
          collection = await createCollection(collectionName);
        } catch (error) {
          console.error(error);
          res.status(403).send("Collection already exists.");
          return;
        }
        console.log(`Collection ${collectionName} created.`);
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

    void generateAndDownload(generationInfoGroup);

    const isCollectionUnique = generationInfoGroup.every(
      (item) => item.id === generationInfoGroup[0].id
    );

    if (generationInfoGroup.length === 1 || isCollectionUnique) {
      res.redirect(`/collection/${collections[0].slug}`);
    } else {
      res.redirect("/collection");
    }
  })();
});

app.get("/collection", (req, res) => {
  void (async () => {
    const collections = await getAllCollections();

    // Get the number of image in each collection
    const numberImagesInCollection: Record<string, number> = {};
    for (const collection of collections) {
      numberImagesInCollection[collection.id] =
        await getNumberImageOfCollection(collection.id);
    }

    // Get the first image of each collection
    const firstImageOfCollection: Record<string, string | null> = {};
    for (const collection of collections) {
      const image = await getFirstImagesOfCollectionId(collection.id);
      const imagePath = image != null ? image.path : null;
      firstImageOfCollection[collection.id] = imagePath;
    }

    res.render("collections", {
      collections,
      numberImagesInCollection,
      firstImageOfCollection,
    });
  })();
});

app.get("/collection/:slug", (req, res) => {
  void (async () => {
    const { slug } = req.params;
    const collection = await getCollectionBySlug(slug);

    // return 404 if the collection doesn't exist
    if (collection == null) {
      res.status(404).send("Collection not found");
      return;
    }

    const images = await getImagesWithPromptByCollectionId(collection.id);

    res.render("collection", { images, collection: collection.name });
  })();
});

app.delete("/image/:id", (req, res) => {
  void (async () => {
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
  })();
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
