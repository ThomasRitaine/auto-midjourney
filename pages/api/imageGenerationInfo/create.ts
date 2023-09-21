import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt, repeat, collectionId, ImageGenerationGroupId } = req.body;

    const newInfo = await prisma.imageGenerationInfo.create({
      data: {
        prompt,
        repeat,
        collectionId,
        ImageGenerationGroupId,
      },
    });

    res.json(newInfo);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
