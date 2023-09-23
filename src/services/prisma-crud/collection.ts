import { Collection, PrismaClient } from '@prisma/client';
import { mkdir } from "fs/promises";


const prisma = new PrismaClient();

function stringToSlug(string: string) {
    return string
      .toLowerCase()                              // Convert the string to lowercase
      .replace(/\s+/g, '-')                       // Replace spaces with hyphens
      .replace(/[^a-z0-9-_]/g, '')                // Remove characters that are not alphanumeric, hyphens, or underscores
      .replace(/^-+|-+$/g, '');                   // Trim hyphens from the beginning and end
}

export const createCollection = async (name: string): Promise<Collection> => {
    const slug = stringToSlug(name);
    const newCollection = await prisma.collection.create({ data: {name, slug} });
    const folder = `image/${slug}`;
    await mkdir(folder, { recursive: true });
    console.log("Collection created", newCollection.name);
    console.log("Collection slug", newCollection.slug);
    return newCollection;
};

export const getAllCollections = async (): Promise<Collection[]> => {
    return await prisma.collection.findMany();
};

export const getCollectionByName = async (name: string): Promise<Collection|null> => {
    return await prisma.collection.findUnique({ where: { name } });
};

export const getCollectionBySlug = async (slug: string): Promise<Collection|null> => {
    return await prisma.collection.findUnique({ where: { slug } });
};

export const getCollectionById = async (id: string): Promise<Collection|null> => {
    return await prisma.collection.findUnique({ where: { id } });
};

export const updateCollection = async (id: string, updatedData: any): Promise<Collection> => {
    return await prisma.collection.update({
        where: { id },
        data: updatedData
    });
};

export const deleteCollection = async (id: string) => {
    return await prisma.collection.delete({ where: { id } });
};