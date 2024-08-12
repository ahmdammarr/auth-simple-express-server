import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = 'your_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Token Required');
  
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    (req as any).user = user;
    next();
  });
};

export const generateAccessToken = (user: { email: string }) => {
  return jwt.sign(user, secret, { expiresIn: '1h' });
};
