import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { filename } = req.query as { filename?: string };

    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required' });
    }

    // Save the file to Vercel Blob Storage
    const blob = await put(
      `uploads/${filename}`,
      req,
      { access: 'public' }
    );

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
}
