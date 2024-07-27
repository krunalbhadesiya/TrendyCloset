// import { NextApiRequest, NextApiResponse } from 'next';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
// import Product from '../../../lib/models/Product';
import Product, { IProduct } from '@/models/Product';

dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
        return createProduct(req, res);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
      default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      name,
      description,
      color,
      size,
      price,
      totalStock,
      imageUrl,
    }: IProduct = req.body;

    // Check required fields, excluding optional ones like imageUrl
    const requiredFields: (keyof Omit<IProduct, 'imageUrl'>)[] = [
      'name',
      'description',
      'color',
      'size',
      'price',
      'totalStock',
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    // Create new product with imageUrl if provided
    const newProduct = new Product({
      name,
      description,
      color,
      size,
      price,
      totalStock,
      currentStock: totalStock,
      imageUrl: imageUrl || null, // Handle optional imageUrl
    });

    await newProduct.save();

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: 'Error creating product' });
  }
};

