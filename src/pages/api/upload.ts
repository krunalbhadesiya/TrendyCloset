import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Configure formidable
const form = new IncomingForm({
  uploadDir: path.join(process.cwd(), 'public', 'upload'),
  keepExtensions: true,
  multiples: true // Allows for multiple file uploads
});

// Define the API route handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle file upload
  if (req.method === 'POST') {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      // Process files
      const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

      // Construct the file paths
      const filePaths = uploadedFiles.map((file: any) => `/upload/${path.basename(file.filepath)}`);

      // Respond with the file paths
      res.status(200).json({ success: true, files: filePaths });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Disable body parsing (formidable will handle it)
export const config = {
  api: {
    bodyParser: false
  }
};
