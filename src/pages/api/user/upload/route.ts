import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ success: false, message: 'Filename is required' });
  }

  // Ensure request.body is not null
  const body = request.body;
  if (!body) {
    return NextResponse.json({ success: false, message: 'No file data provided' });
  }

  try {
    const blob = await put(filename, body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ success: false, message: `Error: ${error}` });
  }
}
