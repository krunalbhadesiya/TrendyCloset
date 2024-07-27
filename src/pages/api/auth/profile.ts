import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../lib/models/User';
import jwt from 'jsonwebtoken';
import { any } from 'zod';

dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ success: false, message: 'JWT_SECRET environment variable is not defined' });
      }

      const decoded = jwt.verify(token, secret as jwt.Secret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: any });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
