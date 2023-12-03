import express, { type Request, type Response } from "express";
import { createGenerationInfo } from "../services/prisma-crud/generationInfo";
import {
  createCollection,
  getCollectionByNameOrSlug,
} from "../services/prisma-crud/collection";
import generateAndDownload from "../services/midjourney/generateAndDownload";
import {
  type User,
  type Collection,
  type GenerationInfo,
  Role,
} from "@prisma/client";
import requireAuth from "../middlewares/requireAuth";
import requireRole from "../middlewares/requireRole";

const router = express.Router();

/**
 * Generation page route: Displays the image generation page to the user.
 * @route GET /generate
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @middleware requireRole - Restricts access to users with GENERATE_RELAX or GENERATE_FAST roles, or ADMIN role.
 * @description Renders the generation page, providing the user roles for UI logic.
 * @returns {Template} Renders the 'generate' template with user roles.
 */
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

/**
 * Image generation and collection addition route.
 * @route POST /generate
 * @middleware requireAuth - Ensures that the user is authenticated.
 * @middleware requireRole - Restricts access to users with GENERATE_RELAX or GENERATE_FAST roles, or ADMIN role.
 * @description Processes the generation of images based on user prompts and adds them to collections.
 *              It also determines the generation speed based on user roles.
 * @param {string} defaultCollection - Default collection name for generated images.
 * @param {string} generationSpeed - The speed of generation (FAST or RELAX).
 * @param {string | string[]} prompt - The prompts used for generating images.
 * @param {number | number[]} repeat - The number of repeats for each prompt.
 * @param {string | string[]} collection - The names of collections to add generated images to.
 * @returns {Response} Redirects to the appropriate collection page after generation.
 */
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

      // Logic to handle collection creation and retrieval
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

      // Creating generation info for each prompt
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

      // Redirect based on the uniqueness of the collection
      if (generationInfoGroup.length === 1 || isCollectionUnique) {
        res.redirect(`/collection/${collections[0].slug}`);
      } else {
        res.redirect("/collection");
      }
    })();
  },
);

export default router;
