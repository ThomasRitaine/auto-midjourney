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
  getNumberAllFavouriteImages,
  isImageGeneratedByUser,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";
import identifyUser from "../middlewares/identifyUser";
import { type Collection, Role, type User } from "@prisma/client";
import { unlinkGenerationInfoFromCollection } from "../services/prisma-crud/generationInfo";

const router = express.Router();

/**
 * Collections overview page.
 * @route GET /collection
 * @middleware identifyUser - Identifies the user but does not restrict access if not authenticated.
 * @description Retrieves and displays collections available to the user. This includes the user's collections, public collections,
 *              and, if authorized, all collections. It also includes information about the number of images and the first image in each collection.
 * @returns {Template} Renders the 'collections' template with the collections and associated data.
 */
router.get("/", identifyUser, (req: Request, res: Response) => {
  void (async () => {
    const user = req.user as User | false;
    // ternal operator to get the userId if user is not false, else null
    const userId = user !== false ? user.id : null;
    const userCollections = await getUserCollections(userId);

    // Get all public collections
    const publicCollections = await getPublicCollections();

    // if the user is logged in and has the "COLLECTION_SEE_ALL" role, querry all collections
    let allCollections: Collection[] = [];
    if (user !== false && user.roles.includes(Role.COLLECTION_SEE_ALL)) {
      allCollections = await getAllCollections();
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

    // Add the total number of favourite image
    numberImagesInCollection.allFavourites =
      await getNumberAllFavouriteImages();

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

/**
 * Favourites collection page.
 * @route GET /collection/favourites
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @description Displays the favourite images of the authenticated user.
 * @returns {Template} Renders the 'collection' template with the user's favourite images.
 */
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

/**
 * Specific collection page.
 * @route GET /collection/:slug
 * @middleware identifyUser - Identifies the user but does not restrict access if not authenticated.
 * @description Retrieves and displays a specific collection based on the slug. It handles privacy settings and
 *              determines if the user can access the collection. Also includes user-specific information, like if the user generated an image or marked it as a favourite.
 * @param {string} slug - The slug of the collection.
 * @returns {Template} Renders the 'collection' template with the specified collection's details.
 */
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

/**
 * Update a collection.
 * @route POST /collection/:id
 * @description Updates the details of a specific collection. This can include changing the name or the public/private status of the collection.
 * @param {string} id - The ID of the collection to update.
 * @returns {Response} Sends a status indicating the success or failure of the operation.
 */
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

/**
 * Delete a collection and its images.
 * @route DELETE /collection/:id
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @description Deletes a specific collection and all its associated images. Restricted to the collection's owner or admin users.
 * @param {string} id - The ID of the collection to delete.
 * @returns {Response} Sends a status message indicating the outcome of the deletion process.
 */
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
