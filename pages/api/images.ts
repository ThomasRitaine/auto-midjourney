import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const images = await prisma.image.findMany();
    return res.json(images);
  }

  if (req.method === 'POST') {
    const image = await prisma.image.create({ data: req.body });
    return res.json(image);
  }

  res.status(405).end();  // Method Not Allowed
};
