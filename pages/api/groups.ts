import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const groups = await prisma.imageGenerationGroup.findMany({
      include: { ImageGenerationInfo: true },
    });
    return res.json(groups);
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;

      // Create the new group
      const newGroup = await prisma.imageGenerationGroup.create({
        data: {
          name: data.name,
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Return the newly created group with its ID
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  res.status(405).end();  // Method Not Allowed
};
