import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from "zod"
import { RequestHandler } from 'express';

import { prisma } from '../lib/prisma'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { verifyRefreshToken } from '../utils/validateToken';


const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

const users: any[] = []; // Temporary in-memory user store

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: "User already exists" })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    res.status(201).json({ message: "User created", userId: user.id })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: "Something went wrong", error: err })
  }
}

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
