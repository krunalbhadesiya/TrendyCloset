import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Contact from '../../../lib/models/Contact';

dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const contact = await Contact.findById(id);
        if (!contact) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: contact });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const contact = await Contact.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!contact) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: contact });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedContact = await Contact.deleteOne({ _id: id });
        if (!deletedContact) {
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
