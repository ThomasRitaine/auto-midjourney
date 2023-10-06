import { type Collection, PrismaClient } from "@prisma/client";
import { mkdir } from "fs/promises";
import slugify from "../../util/slugify";
import { deleteImage } from "./image";
import fs from "fs";

const prisma = new PrismaClient();

export const createCollection = async (
  name: string,
  userId: string,
): Promise<Collection> => {
  const slug = slugify(name);
  const newCollection = await prisma.collection.create({
    data: {
      name,
      slug,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  const folder = `image/${slug}`;
  await mkdir(folder, { recursive: true });
  return newCollection;
};

export const getAllCollections = async (): Promise<Collection[]> => {
  return await prisma.collection.findMany();
};

export const getUserCollections = async (
  userId: string | null,
): Promise<Collection[]> => {
  if (userId == null || userId === "") {
    return [];
  }
  return await prisma.collection.findMany({
    where: {
      userId,
    },
  });
};

export const getPublicCollections = async (): Promise<Collection[]> => {
  return await prisma.collection.findMany({
    where: {
      isPublic: true,
    },
  });
};

export const getCollectionByName = async (
  name: string,
): Promise<Collection | null> => {
  return await prisma.collection.findUnique({ where: { name } });
};

export const getCollectionByNameOrSlug = async (
  name: string,
): Promise<Collection | null> => {
  const collection = await prisma.collection.findUnique({
    where: { name },
  });
  if (collection != null) {
    return collection;
  }
  return await prisma.collection.findUnique({
    where: { slug: slugify(name) },
  });
};

export const getCollectionBySlug = async (
  slug: string,
): Promise<Collection | null> => {
  return await prisma.collection.findUnique({ where: { slug } });
};

export const getCollectionById = async (
  id: string,
): Promise<Collection | null> => {
  return await prisma.collection.findUnique({ where: { id } });
};

export const getNumberImageOfCollection = async (
  id: string,
): Promise<number> => {
  return await prisma.image.count({
    where: {
      collectionId: id,
    },
  });
};

export const getFirstImagesOfCollectionId = async (
  id: string,
): Promise<{ path: string } | null> => {
  const result = await prisma.image.findFirst({
    where: {
      collectionId: id,
    },
    select: {
      path: true,
    },
  });
  return result != null ? { path: result.path } : null;
};

export const updateCollection = async (
  id: string,
  updatedData: any,
): Promise<Collection> => {
  // If the name is updated, update the slug too
  if (updatedData.name != null) {
    updatedData.slug = slugify(updatedData.name);
  }
  return await prisma.collection.update({
    where: { id },
    data: updatedData,
  });
};

export const deleteCollectionWithImages = async (id: string): Promise<void> => {
  const collection = await getCollectionById(id);
  const images = await prisma.image.findMany({
    where: {
      collectionId: id,
    },
  });
  for (const image of images) {
    await deleteImage(image.id);
  }
  fs.rmdirSync(`image/${collection?.slug}`, { recursive: true });
  await prisma.collection.delete({ where: { id } });
};
