import express from "express";
import { deleteImage } from "../services/prisma-crud/image";

const router = express.Router();

router.delete("/image/:id", (req, res) => {
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
