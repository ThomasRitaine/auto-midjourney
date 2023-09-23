import { Collection, GenerationInfo, Image, PrismaClient } from '@prisma/client';
import fs from 'fs';
import { mkdir } from "fs/promises";
import https from 'https';


const prisma = new PrismaClient();

export const createImage = async (imageData: any): Promise<Image> => {
    return await prisma.image.create({ data: imageData });
};

export const createImageByUri = async (uri: string, generationInfo: GenerationInfo): Promise<Image> => {
    const image = await prisma.image.create({
        data: {
            path: uri,
            generationInfo: {
                connect: {
                    id: generationInfo.id
                }
            },
            collection: {
                connect: {
                    id: generationInfo.collectionId
                }
            }
        }
    });

    const extension = uri.split(".").pop();
    const filename = `${image.id}.${extension}`;
    const collection = await prisma.collection.findUnique({ where: { id: generationInfo.collectionId } });
    const folder = `image/${collection?.slug}`;
    
    if (!fs.existsSync(folder)) await mkdir(folder, { recursive: true });
    
    const file = fs.createWriteStream(`${folder}/${filename}`);
    const request = https.get(uri, function(response) {
        response.pipe(file);
    });

    // Update the path value of the image
    await prisma.image.update({
        where: { id: image.id },
        data: { path: `${folder}/${filename}` }
    });

    return image;
};

export const getImageById = async (id: string): Promise<Image|null> => {
    return await prisma.image.findUnique({ where: { id } });
};

export const getImagesByCollectionId = async (collectionId: string): Promise<Image[]|null> => {
    const collection = await prisma.collection.findUnique({
        where: {
          id: collectionId,
        },
        include: {
          images: true,
        },
    });
    
    //return null if the collection doesn't exist, and return the images if it does
    if (!collection) return null;
    return collection.images;
};

export const updateImage = async (id: string, updatedData: any): Promise<Image|null> => {
    return await prisma.image.update({
        where: { id },
        data: updatedData
    });
};

export const deleteImage = async (id: string) => {
    return await prisma.image.delete({ where: { id } });
};

// Closing Prisma Client connection
export const closeConnection = () => {
    prisma.$disconnect();
};
