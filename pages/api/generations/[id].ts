import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const info = await prisma.imageGenerationInfo.findUnique({ where: { id: id as string } });
    if (!info) return res.status(404).json({ error: 'Info not found' });
    return res.json(info);
  }

  if (req.method === 'PUT') {
    const updatedInfo = await prisma.imageGenerationInfo.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.json(updatedInfo);
  }

  if (req.method === 'DELETE') {
    await prisma.imageGenerationInfo.delete({ where: { id: id as string } });
    return res.json({ success: true });
  }

  res.status(405).end();  // Method Not Allowed
};
