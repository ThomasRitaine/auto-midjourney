import express, { type Request, type Response } from "express";
import requireRole from "../../middlewares/requireRole";
import { Role } from "@prisma/client";
import requireAuth from "../../middlewares/requireAuth";
import {
  deleteImage,
  getNonFavouritedImagesCreatedBefore,
} from "../../services/prisma-crud/image";

const router = express.Router();

router.get(
  "/remove-old-images",
  requireAuth,
  requireRole(Role.ADMIN),
  (req: Request, res: Response) => {
    void (async () => {
      // Get all non favourited images that are older than 1 month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      console.log(
        `Removing images created before ${oneMonthAgo.toISOString()}`,
      );
      const imagesToDelete =
        await getNonFavouritedImagesCreatedBefore(oneMonthAgo);

      // Delete each image
      for (const image of imagesToDelete) {
        console.log(`Removing image ${image.id}`);
        await deleteImage(image.id);
      }
    })();

    // Send a 200 response
    res.sendStatus(200);
  },
);

export default router;
