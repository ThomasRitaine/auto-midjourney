import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const image = await prisma.image.findUnique({ where: { id: id as string } });
    if (!image) return res.status(404).json({ error: 'Image not found' });
    return res.json(image);
  }

  if (req.method === 'PUT') {
    const updatedImage = await prisma.image.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.json(updatedImage);
  }

  if (req.method === 'DELETE') {
    await prisma.image.delete({ where: { id: id as string } });
    return res.json({ success: true });
  }

  res.status(405).end();  // Method Not Allowed
};
