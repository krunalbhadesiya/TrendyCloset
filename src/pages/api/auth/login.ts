import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { any } from "zod";

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    try {
      const { username, email, password } = req.body;
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });
      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, error: any });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
