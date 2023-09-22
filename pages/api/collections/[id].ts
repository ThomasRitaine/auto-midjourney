import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const collection = await prisma.collection.findUnique({ where: { id: id as string } });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    return res.json(collection);
  }

  if (req.method === 'PUT') {
    const updatedCollection = await prisma.collection.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.json(updatedCollection);
  }

  if (req.method === 'DELETE') {
    await prisma.collection.delete({ where: { id: id as string } });
    return res.json({ success: true });
  }

  res.status(405).end();  // Method Not Allowed
};
