import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Handler for the POST request
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Extract filename from query parameters
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ success: false, message: 'Filename is required' }, { status: 400 });
    }

    // Check if the request body is a FormData or ReadableStream
    const body = request.body instanceof ReadableStream ? request.body : await request.text();

    // Upload file to Vercel Blob Storage
    const blob = await put(filename, body, { access: 'public' });

    // Return the uploaded file URL
    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' }, { status: 500 });
  }
}
