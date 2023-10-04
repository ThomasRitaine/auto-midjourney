import express, { type Request, type Response } from "express";
import {
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
  updateCollection,
  getUserCollections,
  getPublicCollections,
} from "../services/prisma-crud/collection";
import {
  getFavouriteImagesWithPrompt,
  getImagesByCollection,
  isImageGeneratedByUser,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";
import identifyUser from "../middlewares/identifyUser";
import { type User } from "@prisma/client";

const router = express.Router();
router.get("/", identifyUser, (req: Request, res: Response) => {
  void (async () => {
    const user = req.user as User | false;
    // ternal operator to get the userId if user is not false, else null
    const userId = user !== false ? user.id : null;
    const userCollections = await getUserCollections(userId);
    // Order the collection by updatedAt, the most recent first
    userCollections.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Get all public collections
    const publicCollections = await getPublicCollections();
    // Order the collection by updatedAt, the most recent first
    publicCollections.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Combine the two collections
    const collections = [...userCollections, ...publicCollections];

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

    // Add Favouites to the collections
    const favouritedImages = await getFavouriteImagesWithPrompt(userId);
    numberImagesInCollection.favourites = favouritedImages?.length ?? 0;
    firstImageOfCollection.favourites =
      favouritedImages?.slice(-1)[0]?.path ?? null;

    res.render("collections", {
      userLoggedIn: user !== false,
      userRoles: user !== false ? user.roles : [],
      userCollections,
      publicCollections,
      numberImagesInCollection,
      firstImageOfCollection,
    });
  })();
});

router.get("/favourites", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const user = req.user as User;
    const collection = {
      id: "favourites",
      name: "Favourites",
      slug: "favourites",
    };

    const images = await getFavouriteImagesWithPrompt(user.id);

    // For each image, determine if the user is the owner of the image, and put the boolean in an array with the image id as key
    const isUserGenerator: Record<string, boolean> = {};
    const isFavourite: Record<string, boolean> = {};
    for (const image of images ?? []) {
      isUserGenerator[image.id] = await isImageGeneratedByUser(
        image.id,
        user.id
      );
      isFavourite[image.id] = true;
    }

    res.render("collection", {
      images,
      collection,
      isUserLoggedIn: true,
      isUserGenerator, // Array of [imageId: boolean] where boolean is true if the user is the generator of the image
    });
  })();
});

router.get("/:slug", identifyUser, (req: Request, res: Response) => {
  void (async () => {
    const { slug } = req.params;
    const collection = await getCollectionBySlug(slug);
    const user = req.user as User | false;
    const isUserLoggedIn = user !== false;
    const userId = user !== false ? user.id : null;

    // return 404 if the collection doesn't exist or is not public and the user is not logged in or the user is not the owner of the collection
    if (
      collection == null ||
      (!collection.isPublic && !isUserLoggedIn) ||
      (!collection.isPublic && isUserLoggedIn && collection.userId !== userId)
    ) {
      res.status(404).send("Collection not found");
      return;
    }

    const images = await getImagesByCollection(collection.id, true, true);

    // For each image, determine if the user is the owner of the image, and put the boolean in an array with the image id as key
    const isUserGenerator: Record<string, boolean> = {};
    for (const image of images ?? []) {
      isUserGenerator[image.id] =
        collection != null && collection.userId === userId;
    }

    // For each image, determine if the user has that image in its favourites, and put the boolean in an array with the image id as key
    const isFavourite: Record<string, boolean> = {};
    for (const image of images ?? []) {
      isFavourite[image.id] = image.favouratedByUser.some(
        (user) => user.id === userId
      );
    }

    res.render("collection", {
      isUserLoggedIn,
      collection,
      images,
      isUserGenerator, // Array of [imageId: boolean] where boolean is true if the user is the generator of the image
      isFavourite, // Array of [imageId: boolean] where boolean is true if the user is the generator of the image
    });
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

    await updateCollection(id, updatedData);
    res.sendStatus(200);
  })();
});

export default router;
