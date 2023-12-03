import express, { type Request, type Response } from "express";
import {
  deleteImage,
  getImageWithUserById,
  updateImage,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";
import { Role, type User } from "@prisma/client";

const router = express.Router();

/**
 * Deletes an image.
 * @route DELETE /image/:id
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @description Allows users to delete an image. Admin users can delete any image, while other users can only delete their own images.
 * @param {string} id - The ID of the image to be deleted.
 * @returns {Response} A status message indicating the outcome of the operation.
 */
router.delete("/:id", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const imageId: string = req.params.id;
    const user = req.user as User;
    try {
      // Delete the image if the image belongs to the user or the user has admin role
      if (!user.roles.includes(Role.ADMIN)) {
        const image = await getImageWithUserById(imageId);
        if (image == null || image.generationInfo.user.id !== user.id) {
          res.status(403).send({
            success: false,
            message: "You are not allowed to delete this image.",
          });
          return;
        }
      }
      await deleteImage(imageId);
      res.status(200).send({
        success: true,
        message: `Image ${imageId} deleted successfully.`,
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "Image not found." });
    }
  })();
});

/**
 * Adds an image to the user's favourites.
 * @route POST /image/:id/favourite
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @description Marks an image as a favourite for the authenticated user.
 * @param {string} id - The ID of the image to be favourited.
 * @returns {Response} A success message with the image and user IDs.
 */
router.post("/:id/favourite", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const imageId = req.params.id;
    const user = req.user as User;
    try {
      // Add image with id imageId to favourites of user
      await updateImage(imageId, {
        favouratedByUser: {
          connect: { id: user.id },
        },
      });
      res.status(200).send({
        success: true,
        message: `Image ${imageId} added to favourites of user ${user.id}.`,
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "Internal server error." });
    }
  })();
});

/**
 * Removes an image from the user's favourites.
 * @route DELETE /image/:id/favourite
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @description Removes an image from the authenticated user's list of favourites.
 * @param {string} id - The ID of the image to be removed from favourites.
 * @returns {Response} A success message with the image and user IDs.
 */
router.delete("/:id/favourite", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const imageId = req.params.id;
    try {
      const user = req.user as User;
      // Remove image with id imageId to favourites of user
      await updateImage(imageId, {
        favouratedByUser: {
          disconnect: { id: user.id },
        },
      });
      res.status(200).send({
        success: true,
        message: `Image ${imageId} removed from favourites of user ${user.id}.`,
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "Internal server error." });
    }
  })();
});

export default router;
