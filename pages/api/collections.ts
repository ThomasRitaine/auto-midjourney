import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const collections = await prisma.collection.findMany();
    return res.json(collections);
  }

  if (req.method === 'POST') {
    const collection = await prisma.collection.create({ data: req.body });
    return res.json(collection);
  }

  res.status(405).end();  // Method Not Allowed
};
