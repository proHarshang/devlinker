import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { RequestHandler } from 'express';

import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { verifyRefreshToken } from '../utils/validateToken';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Something went wrong', error: err });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const handleRefresh: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ message: 'Refresh token missing' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refreh token error:', err);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};
