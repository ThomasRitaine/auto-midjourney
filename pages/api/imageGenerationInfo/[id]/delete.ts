import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const deletedInfo = await prisma.imageGenerationInfo.delete({
      where: { id },
    });

    res.json(deletedInfo);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
