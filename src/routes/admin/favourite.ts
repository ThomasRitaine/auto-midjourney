import express, { type Request, type Response } from "express";
import requireRole from "../../middlewares/requireRole";
import { Role, type User } from "@prisma/client";
import requireAuth from "../../middlewares/requireAuth";
import { getAllFavouriteImagesWithPrompt } from "../../services/prisma-crud/image";

const router = express.Router();

router.get(
  "/admin/favourite",
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

      // For each image, determine if the user is the owner of the image, and put the boolean in an array with the image id as key
      const isUserGenerator: Record<string, boolean> = {};
      const isFavourite: Record<string, boolean> = {};
      for (const image of images ?? []) {
        isUserGenerator[image.id] = true;
        isFavourite[image.id] = image.favouratedByUser.some(
          (userFavouatingImage) => userFavouatingImage.id === user.id,
        );
      }

      res.render("collection", {
        images,
        collection,
        isUserLoggedIn: true,
        isUserGenerator, // Array of [imageId: boolean] where boolean is true if the user is the generator of the image
        isFavourite,
      });
    })();
  },
);

export default router;
