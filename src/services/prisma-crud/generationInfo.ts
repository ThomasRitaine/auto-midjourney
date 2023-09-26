import { type GenerationInfo, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GenerationInfo CRUD operations
export const createGenerationInfo = async (
  infoData: any
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.create({ data: infoData });
};

export const getGenerationInfoById = async (
  id: string
): Promise<GenerationInfo | null> => {
  return await prisma.generationInfo.findUnique({ where: { id } });
};

export const updateGenerationInfo = async (
  id: string,
  updatedData: any
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.update({
    where: { id },
    data: updatedData,
  });
};

export const deleteGenerationInfo = async (
  id: string
): Promise<GenerationInfo> => {
  return await prisma.generationInfo.delete({ where: { id } });
};
