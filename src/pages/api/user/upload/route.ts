import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const chunks: Uint8Array[] = [];
    const filename = `${uuidv4()}-${req.query.filename}`;

    req.on('data', chunk => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      const fileBuffer = Buffer.concat(chunks);

      // Upload file to Vercel Blob Storage
      const blob = await put(filename, fileBuffer, { access: 'public' });

      // Return the uploaded file URL
      res.status(200).json({ success: true, url: blob.url });
    });

    req.on('error', error => {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: 'Error uploading file' });
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
}
