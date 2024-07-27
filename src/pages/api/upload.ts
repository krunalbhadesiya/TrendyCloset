import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
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

const parseMultipartFormData = (req: NextApiRequest): Promise<{ file: Buffer }> => {
  return new Promise((resolve, reject) => {
    let body = Buffer.alloc(0);
    let boundary = '';

    req.on('data', chunk => {
      body = Buffer.concat([body, chunk]);
    });

    req.on('end', () => {
      const contentType = req.headers['content-type'];
      if (contentType) {
        boundary = contentType.split('boundary=')[1];
      }

      const boundaryBuffer = Buffer.from(`--${boundary}`, 'utf-8');
      const endBoundaryBuffer = Buffer.from(`--${boundary}--`, 'utf-8');

      const start = body.indexOf(boundaryBuffer) + boundaryBuffer.length + 2;
      const end = body.indexOf(endBoundaryBuffer);

      if (start === -1 || end === -1) {
        return reject(new Error('Boundary not found'));
      }

      const fileBuffer = body.slice(start, end);

      resolve({ file: fileBuffer });
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { file } = await parseMultipartFormData(req);
    
    const filename = req.query.filename as string;
    const uniqueFilename = generateUniqueFilename(filename);

    const blob = await put(uniqueFilename, file, { access: 'public' });

    res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
}
