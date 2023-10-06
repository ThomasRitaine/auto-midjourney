import express, { type Request, type Response } from "express";
import {
  getCollectionBySlug,
  getNumberImageOfCollection,
  getFirstImagesOfCollectionId,
  updateCollection,
  getUserCollections,
  getPublicCollections,
  getAllCollections,
  getCollectionById,
  deleteCollectionWithImages,
} from "../services/prisma-crud/collection";
import {
  getFavouriteImagesWithPrompt,
  getImagesByCollection,
  isImageGeneratedByUser,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";
import identifyUser from "../middlewares/identifyUser";
import { type Collection, Role, type User } from "@prisma/client";
import { unlinkGenerationInfoFromCollection } from "../services/prisma-crud/generationInfo";

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
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    // Get all public collections
    const publicCollections = await getPublicCollections();
    // Order the collection by updatedAt, the most recent first
    publicCollections.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    // if the user is logged in and has the "COLLECTION_SEE_ALL" role, querry all collections
    let allCollections: Collection[] = [];
    if (user !== false && user.roles.includes(Role.COLLECTION_SEE_ALL)) {
      allCollections = await getAllCollections();
      // Order the collection by updatedAt, the most recent first
      allCollections.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }

    // Combine the two collections
    const collectionsToDisplay = [
      ...userCollections,
      ...publicCollections,
      ...allCollections,
    ];

    // Get the number of image in each collection
    const numberImagesInCollection: Record<string, number> = {};
    for (const collection of collectionsToDisplay) {
      numberImagesInCollection[collection.id] =
        await getNumberImageOfCollection(collection.id);
    }

    // Get the first image of each collection
    const firstImageOfCollection: Record<string, string | null> = {};
    for (const collection of collectionsToDisplay) {
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
      allCollections,
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
        user.id,
      );
      isFavourite[image.id] = true;
    }

    res.render("collection", {
      images,
      collection,
      isUserLoggedIn: true,
      isUserGenerator, // Array of [imageId: boolean] where boolean is true if the user is the generator of the image
      isFavourite,
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

    // If the user is logged in and has the "ADMIN" or the "COLLECTION_SEE_ALL" role, bypass the privacy of the collection
    const bypassCollectionPrivacy =
      isUserLoggedIn &&
      user?.roles.some((item) =>
        [Role.ADMIN as string, Role.COLLECTION_SEE_ALL as string].includes(
          item as string,
        ),
      );

    // return 404 if the collection doesn't exist or is not public and the user is not logged in or the user is not the owner of the collection
    if (!bypassCollectionPrivacy) {
      if (
        collection == null ||
        (!collection.isPublic && !isUserLoggedIn) ||
        (!collection.isPublic && isUserLoggedIn && collection.userId !== userId)
      ) {
        res.status(404).send("Collection not found");
        return;
      }
    }

    if (collection == null) {
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
        (user) => user.id === userId,
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

// Route to delete a collection and all its images
router.delete("/:id", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const collectionId = req.params.id;
    const user = req.user as User;
    try {
      // Delete the collection if the collection belongs to the user or the user has admin role
      if (
        !user.roles.some((role) =>
          [Role.ADMIN as string, Role.COLLECTION_DELETE_ALL as string].includes(
            role,
          ),
        )
      ) {
        const collection = await getCollectionById(collectionId);
        if (collection == null || collection.userId !== user.id) {
          res.status(403).send({
            success: false,
            message: "You are not allowed to delete this collection.",
          });
          return;
        }
      }
      // Unlink the collection from the generationInfo
      await unlinkGenerationInfoFromCollection(collectionId);

      // Delete the collection
      await deleteCollectionWithImages(collectionId);
      res.status(200).send({
        success: true,
        message: `Collection ${collectionId} deleted successfully.`,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Internal server error." });
    }
  })();
});

export default router;
