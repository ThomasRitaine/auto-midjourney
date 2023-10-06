import { type GenerationInfo, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GenerationInfo CRUD operations
export const createGenerationInfo = async (
  prompt: string,
  repeat: number,
  collectionId: string,
  userId: string,
  speed: "FAST" | "RELAX",
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.create({
    data: {
      prompt,
      repeat,
      collection: { connect: { id: collectionId } },
      user: { connect: { id: userId } },
      speed,
    },
  });
};

export const getGenerationInfoById = async (
  id: string,
): Promise<GenerationInfo | null> => {
  return await prisma.generationInfo.findUnique({ where: { id } });
};

export const updateGenerationInfo = async (
  id: string,
  updatedData: any,
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.update({
    where: { id },
    data: updatedData,
  });
};

export const unlinkGenerationInfoFromCollection = async (
  collectionId: string,
): Promise<void> => {
  await prisma.generationInfo.updateMany({
    where: {
      collectionId,
    },
    data: {
      collectionId: null,
    },
  });
};

export const deleteGenerationInfo = async (
  id: string,
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.delete({ where: { id } });
};
