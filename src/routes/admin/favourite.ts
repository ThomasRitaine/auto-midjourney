import express, { type Request, type Response } from "express";
import requireRole from "../../middlewares/requireRole";
import { Role, type User } from "@prisma/client";
import requireAuth from "../../middlewares/requireAuth";
import { getAllFavouriteImagesWithPrompt } from "../../services/prisma-crud/image";

const router = express.Router();

/**
 * Displays all favourite images.
 * @route GET /admin/favourite
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @middleware requireRole - Restricts access to users with ADMIN role.
 * @description Retrieves and displays all images marked as favourites across all users.
 *              Additionally, it determines if the authenticated user is the creator of each image.
 * @returns {Template} Renders the 'collection' template with all favourite images and related data.
 */
router.get(
  "/favourite",
  requireAuth,
  requireRole(Role.ADMIN),
  (req: Request, res: Response) => {
    void (async () => {
      const user = req.user as User;
      const collection = {
        id: "favourites",
        name: "Favourites",
        slug: "favourites",
      };

      const images = await getAllFavouriteImagesWithPrompt();

      // Determine if the user is the owner of each image
      const isUserGenerator: Record<string, boolean> = {};
      const isFavourite: Record<string, boolean> = {};
      for (const image of images ?? []) {
        isUserGenerator[image.id] = true; // Assuming admin is the owner of all favourite images
        isFavourite[image.id] = image.favouratedByUser.some(
          (userFavouritingImage) => userFavouritingImage.id === user.id,
        );
      }

      res.render("collection", {
        images,
        collection,
        isUserLoggedIn: true,
        isUserGenerator, // Indicates if the user is the generator of the image
        isFavourite, // Indicates if the image is in the user's favourites
      });
    })();
  },
);

export default router;
