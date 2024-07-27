import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse multipart form-data
const parseMultipartFormData = async (req: IncomingMessage) => {
  return new Promise<{ fields: any; file: Buffer }>((resolve, reject) => {
    let data: Buffer[] = [];
    const boundary = req.headers['content-type']?.split('boundary=')[1] || '';
    if (!boundary) {
      reject('No boundary found in content-type header');
      return;
    }

    const boundaryBuffer = Buffer.from(`--${boundary}`, 'utf8');
    const endBoundaryBuffer = Buffer.from(`--${boundary}--`, 'utf8');
    let isFile = false;
    let fileData: Buffer[] = [];

    req.on('data', (chunk) => {
      data.push(chunk);
    });

    req.on('end', () => {
      const buffer = Buffer.concat(data);
      let start = buffer.indexOf(boundaryBuffer);
      while (start !== -1) {
        const end = buffer.indexOf('\r\n\r\n', start);
        if (end === -1) break;

        const header = buffer.slice(start, end).toString();
        const isFilePart = header.includes('Content-Disposition: form-data; name="file"');
        const contentStart = end + 4;
        const nextBoundaryStart = buffer.indexOf(boundaryBuffer, contentStart);
        const contentEnd = nextBoundaryStart === -1 ? buffer.indexOf(endBoundaryBuffer) : nextBoundaryStart;

        if (isFilePart) {
          isFile = true;
          fileData.push(buffer.slice(contentStart, contentEnd - 2)); // Exclude trailing \r\n
        }

        start = nextBoundaryStart;
      }

      if (isFile) {
        resolve({ fields: {}, file: Buffer.concat(fileData) });
      } else {
        reject('No file found');
      }
    });

    req.on('error', (err) => reject(err));
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { file } = await parseMultipartFormData(req);

    const uploadPath = path.join(process.cwd(), 'public', 'upload', 'user');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate a unique file name
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join(uploadPath, fileName);
    await promisify(fs.writeFile)(filePath, file);

    res.status(200).json({ success: true, url: `/upload/user/${fileName}` });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error: ${error}` });
  }
};

export default handler;
