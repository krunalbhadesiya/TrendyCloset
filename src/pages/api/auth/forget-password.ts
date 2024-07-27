import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import User from "../../../lib/models/User";
import crypto from 'crypto';
import sendMail from '../../../lib/sendMail'; // Adjust the import path if necessary

dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();

      const resetUrl = `${req.headers.origin}/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) have requested the reset of a password.\n\nPlease make a PUT request to: \n\n${resetUrl}`;

      await sendMail(user.email, 'Password Reset Request', message);

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
