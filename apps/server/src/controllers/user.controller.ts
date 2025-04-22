import { Request, Response } from 'express';

import { prisma } from '@/lib/prisma';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    console.log('get user' + req.userId);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
