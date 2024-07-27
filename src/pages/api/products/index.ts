import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../lib/models/Product';

dbConnect();

const uploadImage = async (file: Buffer, filename: string) => {
  // This function uses the image upload endpoint to store the image
  const response = await fetch(`${process.env.BASE_URL}/api/upload?filename=${filename}`, {
    method: 'POST',
    body: file,
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.url;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        // Assuming `req.body` includes the image file
        const { name, description, totalStock, size, color, price, image } = req.body;

        // Check if an image is being uploaded
        let imageUrl = '';
        if (image) {
          const imageFilename = 'product-image.jpg'; // Replace with actual logic to derive filename
          imageUrl = await uploadImage(image, imageFilename);
        }

        const product = await Product.create({
          name,
          description,
          totalStock,
          size,
          color,
          price,
          imageUrl,
        });

        res.status(201).json({ success: true, data: product });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
