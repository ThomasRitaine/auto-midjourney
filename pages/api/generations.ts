import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const generations = await prisma.imageGenerationInfo.findMany();
    return res.json(generations);
  }

  if (req.method === 'POST') {
    const info = await prisma.imageGenerationInfo.create({ data: req.body });
    return res.json(info);
  }

  res.status(405).end();  // Method Not Allowed
};
