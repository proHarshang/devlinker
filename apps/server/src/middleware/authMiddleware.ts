import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/validateToken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};
