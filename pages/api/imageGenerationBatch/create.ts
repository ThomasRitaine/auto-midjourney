import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;

    const newBatch = await prisma.ImageGenerationGroup.create({
      data: {
        name,
      },
    });

    res.json(newBatch);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
