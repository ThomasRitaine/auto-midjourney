import express, { type Request, type Response } from "express";
import {
  deleteImage,
  getImageWithUserById,
  updateImage,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";
import { type User } from "@prisma/client";

const router = express.Router();

router.delete("/:id", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const imageId: string = req.params.id;
    const user = req.user as User;
    try {
      // Delete the image if the image belongs to the user or the user has admin role
      if (!user.roles.includes("ADMIN")) {
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
