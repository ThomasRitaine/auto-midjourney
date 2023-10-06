import express, { type Request, type Response } from "express";
import { createGenerationInfo } from "../services/prisma-crud/generationInfo";
import {
  createCollection,
  getCollectionByNameOrSlug,
} from "../services/prisma-crud/collection";
import generateAndDownload from "../midjourney/generateAndDownload";
import {
  type User,
  type Collection,
  type GenerationInfo,
  Role,
} from "@prisma/client";
import requireAuth from "../middlewares/requireAuth";
import requireRole from "../middlewares/requireRole";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole(Role.GENERATE_RELAX, Role.GENERATE_FAST),
  (req: Request, res: Response) => {
    const user = req.user as User;
    const userRoles = user.roles;
    // If admin, add both roles
    if (userRoles.includes(Role.ADMIN)) {
      userRoles.push(Role.GENERATE_RELAX, Role.GENERATE_FAST);
    }
    res.render("generate", { userRoles });
  },
);

router.post(
  "/",
  requireAuth,
  requireRole(Role.GENERATE_RELAX, Role.GENERATE_FAST),
  (req: Request, res: Response) => {
    void (async () => {
      const user = req.user as User;

      const defaultCollection: string = req.body.defaultCollection;

      // Get the right generation speed based on the user's roles and request
      let generationSpeed: "FAST" | "RELAX";
      if (
        user.roles.includes(Role.GENERATE_RELAX) &&
        !user.roles.includes(Role.GENERATE_FAST)
      ) {
        generationSpeed = "RELAX";
      } else {
        generationSpeed =
          req.body.generationSpeed === "FAST" ? "FAST" : "RELAX";
      }

      const prompts = Array.isArray(req.body.prompt)
        ? req.body.prompt
        : [req.body.prompt];

      const repeats = Array.isArray(req.body.repeat)
        ? req.body.repeat
        : [req.body.repeat];

      const collectionsName = Array.isArray(req.body.collection)
        ? req.body.collection
        : [req.body.collection];

      const collections: Collection[] = [];

      for (let collectionName of collectionsName) {
        collectionName =
          collectionName === "" ? defaultCollection : collectionName;

        let collection = await getCollectionByNameOrSlug(collectionName);
        if (collection == null) {
          try {
            collection = await createCollection(collectionName, user.id);
          } catch (error) {
            console.error(error);
            res.status(403).send("Collection already exists.");
            return;
          }
          console.log(`Collection ${collectionName} created.`);
        }
        collections.push(collection);
      }

      const generationInfoGroup: GenerationInfo[] = [];

      for (let index = 0; index < prompts.length; index++) {
        const prompt = prompts[index];
        const generationInfo = await createGenerationInfo(
          prompt,
          parseInt(repeats[index]),
          collections[index].id,
          user.id,
          generationSpeed,
        );
        generationInfoGroup.push(generationInfo);
      }

      void generateAndDownload(generationInfoGroup);

      const isCollectionUnique = generationInfoGroup.every(
        (item) => item.id === generationInfoGroup[0].id,
      );

      if (generationInfoGroup.length === 1 || isCollectionUnique) {
        res.redirect(`/collection/${collections[0].slug}`);
      } else {
        res.redirect("/collection");
      }
    })();
  },
);

export default router;
