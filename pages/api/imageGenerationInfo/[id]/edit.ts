import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { prompt, repeat, collectionId, ImageGenerationGroupId } = req.body;

    const updatedInfo = await prisma.imageGenerationInfo.update({
      where: { id },
      data: {
        prompt,
        repeat,
        collectionId,
        ImageGenerationGroupId,
      },
    });

    res.json(updatedInfo);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
