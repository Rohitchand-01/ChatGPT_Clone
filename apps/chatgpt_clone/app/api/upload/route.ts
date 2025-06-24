// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '../../lib/cloudinary'; // Use alias if set in tsconfig
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stream = Readable.from(buffer);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'uploads' }, // Optional: specify folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.pipe(uploadStream);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
