import express from "express";
import {
  getAllCollections,
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
} from "../services/prisma-crud/collection";
import { getImagesWithPromptByCollectionId } from "../services/prisma-crud/image";

const router = express.Router();

router.get("/", (req, res) => {
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

router.get("/:slug", (req, res) => {
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

export default router;
