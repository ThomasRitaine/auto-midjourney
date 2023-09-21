import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const infos = await prisma.imageGenerationInfo.findMany();
    res.json(infos);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
