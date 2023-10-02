import express, { type Request, type Response } from "express";
import {
  getAllCollections,
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
  updateCollection,
  getNumberImageFavourite,
} from "../services/prisma-crud/collection";
import {
  getFavouriteImagesWithPrompt,
  getFirstImagesOfFavourites,
  getImagesWithPromptByCollectionId,
} from "../services/prisma-crud/image";
import authenticateJWT from "../middlewares/authenticateJWT";

const router = express.Router();
router.get("/", authenticateJWT, (req: Request, res: Response) => {
  void (async () => {
    const collections = await getAllCollections();

    // Get the number of image in each collection
    const numberImagesInCollection: Record<string, number> = {};
    for (const collection of collections) {
      numberImagesInCollection[collection.id] =
        await getNumberImageOfCollection(collection.id);
    }

    // Add the number of favourite images
    numberImagesInCollection.favourites = await getNumberImageFavourite();

    // Get the first image of each collection
    const firstImageOfCollection: Record<string, string | null> = {};
    for (const collection of collections) {
      const image = await getFirstImagesOfCollectionId(collection.id);
      const imagePath = image != null ? image.path : null;
      firstImageOfCollection[collection.id] = imagePath;
    }

    // Add the first image of the favourite collection
    const firstFavouriteImage = await getFirstImagesOfFavourites();
    const firstFavouriteImagePath =
      firstFavouriteImage != null ? firstFavouriteImage.path : null;
    firstImageOfCollection.favourites = firstFavouriteImagePath;

    res.render("collections", {
      collections,
      numberImagesInCollection,
      firstImageOfCollection,
    });
  })();
});

router.get("/favourites", authenticateJWT, (req: Request, res: Response) => {
  void (async () => {
    const collection = {
      id: "favourites",
      name: "Favourites",
      slug: "favourites",
    };

    const images = await getFavouriteImagesWithPrompt();

    res.render("collection", { images, collection });
  })();
});

router.get("/:slug", (req: Request, res: Response) => {
  void (async () => {
    const { slug } = req.params;
    const collection = await getCollectionBySlug(slug);

    // return 404 if the collection doesn't exist
    if (collection == null) {
      res.status(404).send("Collection not found");
      return;
    }

    const images = await getImagesWithPromptByCollectionId(collection.id);

    res.render("collection", { images, collection });
  })();
});

// Route to update a collection
router.post("/:id", (req: Request, res: Response) => {
  void (async () => {
    const { id } = req.params;

    const isPublicStatus = req.body.isPublic;
    console.log("isPublicStatus", isPublicStatus);

    // Get name and isPublic from the req.params, but they may not exist
    const name: string | null = req.body.name;
    const isPublic: boolean | null = req.body.isPublic;

    // create a updatedData object with only the data that is not null
    const updatedData: any = {};
    if (name != null) {
      updatedData.name = name;
    }
    if (isPublic != null) {
      updatedData.isPublic = isPublic;
    }

    console.log("updatedData", updatedData);

    await updateCollection(id, updatedData);
    res.sendStatus(200);
  })();
});

export default router;
