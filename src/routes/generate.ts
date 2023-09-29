import express from "express";
import { createGenerationInfo } from "../services/prisma-crud/generationInfo";
import {
  createCollection,
  getCollectionByNameOrSlug,
} from "../services/prisma-crud/collection";
import generateAndDownload from "../midjourney/generateAndDownload";
import { type Collection, type GenerationInfo } from "@prisma/client";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("generate");
});

router.post("/", (req, res) => {
  void (async () => {
    const userToken: string = req.body.token;

    if (userToken !== process.env.GENERATION_TOKEN) {
      res.status(403).send("Invalid token.");
      return;
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

    const defaultCollection: string = req.body.defaultCollection;

    const collections: Collection[] = [];

    for (let collectionName of collectionsName) {
      collectionName =
        collectionName === "" ? defaultCollection : collectionName;

      let collection = await getCollectionByNameOrSlug(collectionName);
      if (collection == null) {
        try {
          collection = await createCollection(collectionName);
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
      const generationInfo = await createGenerationInfo({
        prompt,
        repeat: parseInt(repeats[index]),
        collection: {
          connect: {
            id: collections[index].id,
          },
        },
      });
      generationInfoGroup.push(generationInfo);
    }

    void generateAndDownload(generationInfoGroup);

    const isCollectionUnique = generationInfoGroup.every(
      (item) => item.id === generationInfoGroup[0].id
    );

    if (generationInfoGroup.length === 1 || isCollectionUnique) {
      res.redirect(`/collection/${collections[0].slug}`);
    } else {
      res.redirect("/collection");
    }
  })();
});

export default router;
