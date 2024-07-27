import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateUniqueFilename = (originalFilename: string): string => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-GB', { hour12: false }).replace(/:/g, '-');
  const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
  const uniqueString = `${timestamp}-${date}-${uuidv4()}`;
  const fileExtension = originalFilename.split('.').pop();
  return `${uniqueString}.${fileExtension}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const chunks: Uint8Array[] = [];
    let originalFilename: string | null = null;

    req.on('data', chunk => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      const fileBuffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const filenameMatch = contentType.match(/filename="(.+)"/);
      if (filenameMatch) {
        originalFilename = filenameMatch[1];
      } else {
        return res.status(400).json({ success: false, message: 'Filename not provided' });
      }

      if (!originalFilename) {
        return res.status(400).json({ success: false, message: 'Filename is required' });
      }

      const uniqueFilename = generateUniqueFilename(originalFilename);

      // Upload file to Vercel Blob Storage
      const blob = await put(uniqueFilename, fileBuffer, { access: 'public' });

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
