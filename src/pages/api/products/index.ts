import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Product, { IProduct } from '@/models/Product';

// Connect to MongoDB
const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI as string);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  if (req.method === 'POST') {
    return createProduct(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

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

export default handler;
