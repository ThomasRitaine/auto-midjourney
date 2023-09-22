import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const group = await prisma.imageGenerationGroup.findUnique({
      where: { id: id as string },
      include: { ImageGenerationInfo: true },
    });

    if (!group) return res.status(404).json({ error: 'Group not found' });
    
    return res.json(group);
  }

  if (req.method === 'PUT') {
    const updatedGroup = await prisma.imageGenerationGroup.update({
      where: { id: id as string },
      data: req.body,
    });
    return res.json(updatedGroup);
  }

  if (req.method === 'DELETE') {
    await prisma.imageGenerationGroup.delete({
      where: { id: id as string },
    });
    return res.json({ success: true });
  }

  res.status(405).end();  // Method Not Allowed
};
