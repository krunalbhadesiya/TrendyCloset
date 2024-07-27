import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Review from '../../../lib/models/Review';

dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const review = await Review.findById(id);
        if (!review) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: review });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const review = await Review.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!review) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: review });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedReview = await Review.deleteOne({ _id: id });
        if (!deletedReview) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
