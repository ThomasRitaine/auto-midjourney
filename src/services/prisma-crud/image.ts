import {
  type GenerationInfo,
  type Image,
  PrismaClient,
  type Prisma,
} from "@prisma/client";
import fs from "fs";
import { mkdir } from "fs/promises";
import sharp from "sharp";
import downloadImage from "../../util/downloadImage";

const prisma = new PrismaClient();

export const createImage = async (imageData: any): Promise<Image> => {
  return await prisma.image.create({ data: imageData });
};

export const createImageByUri = async (
  uri: string,
  generationInfo: GenerationInfo
): Promise<Image> => {
  const image = await prisma.image.create({
    data: {
      path: uri,
      generationInfo: {
        connect: {
          id: generationInfo.id,
        },
      },
      collection: {
        connect: {
          id: generationInfo.collectionId,
        },
      },
    },
  });

  const collection = await prisma.collection.findUnique({
    where: { id: generationInfo.collectionId },
  });

  const extension = uri.split(".").pop();
  const nativeFileName = `${image.id}.${extension}`;
  const folder = `image/${collection?.slug}`;
  const nativeFilePath = `${folder}/${nativeFileName}`;
  const webpFilePath = `${folder}/${image.id}.webp`;

  if (!fs.existsSync(folder)) await mkdir(folder, { recursive: true });

  try {
    await downloadImage(uri, folder, image.id);
    console.log("Image downloaded.");
  } catch (error) {
    console.error("Failed to download image:", error);
  }

  // Optimizing the image
  await sharp(nativeFilePath)
    .webp({ smartSubsample: true })
    .toFile(webpFilePath);

  // Delete the native image
  fs.unlinkSync(nativeFilePath);

  // Update the path value of the image
  await prisma.image.update({
    where: { id: image.id },
    data: { path: webpFilePath },
  });
  console.log("Image optimized.");

  return image;
};

export const getImageById = async (id: string): Promise<Image | null> => {
  return await prisma.image.findUnique({ where: { id } });
};

export const getImageWithUserById = async (
  id: string
): Promise<(Image & { generationInfo: { user: { id: string } } }) | null> => {
  return await prisma.image.findUnique({
    where: { id },
    include: {
      generationInfo: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const isImageGeneratedByUser = async (
  imageId: string,
  userId: string
): Promise<boolean> => {
  const image = await prisma.image.findUnique({
    where: {
      id: imageId,
    },
    include: {
      generationInfo: {
        include: {
          user: true,
        },
      },
    },
  });
  return image?.generationInfo.user.id === userId;
};

export const getImagesByCollectionId = async (
  collectionId: string
): Promise<Image[] | null> => {
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
    include: {
      images: true,
    },
  });

  // return null if the collection doesn't exist, and return the images if it does
  if (collection == null) return null;
  return collection.images;
};

export const getImagesByCollection = async (
  collectionId: string,
  includePrompt: boolean,
  includeFavoratedBy: boolean
): Promise<
  | Array<
      Image & { generationInfo: { prompt: string } } & {
        favouratedByUser: Array<{ id: string }>;
      }
    >
  | []
> => {
  // If includePrompt is true, include the prompt in the query
  const include: Prisma.ImageInclude = {};
  if (includePrompt) {
    include.generationInfo = {
      select: {
        prompt: true,
      },
    };
  }
  if (includeFavoratedBy) {
    include.favouratedByUser = true;
  }
  const images = await prisma.image.findMany({
    where: {
      collectionId,
    },
    include,
  });
  return images;
};

export const getFavouriteImagesWithPrompt = async (
  userId: string | null
): Promise<Image[] | null> => {
  const images = await prisma.image.findMany({
    where: {
      favouratedByUser: {
        some: {
          id: userId ?? "",
        },
      },
    },
    include: {
      generationInfo: {
        select: {
          prompt: true,
        },
      },
    },
  });
  return images;
};

export const getRandomPublicImage = async (): Promise<Image | null> => {
  // Get all public collections
  const publicCollections = await prisma.collection.findMany({
    where: {
      isPublic: true,
    },
  });

  // If there are no public collections, return null
  if (publicCollections.length === 0) {
    return null;
  }

  // Select a random collection
  const randomCollection =
    publicCollections[Math.floor(Math.random() * publicCollections.length)];

  // Get all images in the collection
  const images = await prisma.image.findMany({
    where: {
      collectionId: randomCollection.id,
    },
  });

  // If there are no images in the collection, return null
  if (images.length === 0) {
    return null;
  }

  // Select a random image
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return randomImage;
};

export const updateImage = async (
  id: string,
  updatedData: any
): Promise<Image | null> => {
  return await prisma.image.update({
    where: { id },
    data: updatedData,
  });
};

export const deleteImage = async (id: string): Promise<void> => {
  const image = await prisma.image.findUnique({ where: { id } });
  if (image == null) return;
  fs.unlinkSync(image.path);
  await prisma.image.delete({ where: { id } });
};
