import express, { type Request, type Response } from "express";
import {
  deleteImage,
  getImageById,
  updateImage,
} from "../services/prisma-crud/image";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

router.post(
  "/:id/toggle-favourite",
  requireAuth,
  (req: Request, res: Response) => {
    void (async () => {
      const { id } = req.params;
      try {
        const image = await getImageById(id);
        if (image == null) {
          throw new Error("Image not found.");
        }
        await updateImage(id, { isFavourite: !image.isFavourite });
        res.status(200).send({
          success: true,
          message: `Image ${id} ${
            image.isFavourite ? "removed from" : "added to"
          } favourite successfully.`,
        });
      } catch (error) {
        res.status(404).send({ success: false, message: "Image not found." });
      }
    })();
  }
);

router.delete("/:id", requireAuth, (req: Request, res: Response) => {
  void (async () => {
    const { id } = req.params;
    try {
      await deleteImage(id);
      res.status(200).send({
        success: true,
        message: `Image ${id} deleted successfully.`,
      });
    } catch (error) {
      res.status(404).send({ success: false, message: "Image not found." });
    }
  })();
});

export default router;
