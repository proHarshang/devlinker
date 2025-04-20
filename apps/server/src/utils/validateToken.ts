import jwt from 'jsonwebtoken';

export const verifyAccessToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  };
  
  export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  };