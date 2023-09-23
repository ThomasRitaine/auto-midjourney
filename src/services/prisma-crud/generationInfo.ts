import { Collection, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// GenerationInfo CRUD operations
export const createGenerationInfo = async (infoData: any) => {
    return await prisma.generationInfo.create({ data: infoData });
};

export const getGenerationInfoById = async (id: string) => {
    return await prisma.generationInfo.findUnique({ where: { id } });
};

export const updateGenerationInfo = async (id: string, updatedData: any) => {
    return await prisma.generationInfo.update({
        where: { id },
        data: updatedData
    });
};

export const deleteGenerationInfo = async (id: string) => {
    return await prisma.generationInfo.delete({ where: { id } });
};
