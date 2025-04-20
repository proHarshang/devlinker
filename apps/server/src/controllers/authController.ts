import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { verifyRefreshToken } from '../utils/validateToken';

const users: any[] = []; // Temporary in-memory user store

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const accessToken = generateAccessToken(user.username);
  const refreshToken = generateRefreshToken(user.username);

  res.status(200).json({ accessToken, refreshToken });
};

export const refreshToken = (req: Request, res: Response): void => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
