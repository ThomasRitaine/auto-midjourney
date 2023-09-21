import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'


const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name } = req.body;

    const updatedBatch = await prisma.ImageGenerationGroup.update({
      where: { id },
      data: {
        name,
      },
    });

    res.json(updatedBatch);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
