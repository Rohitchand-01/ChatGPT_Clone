import { NextResponse } from 'next/server';
import cloudinary from '../../../lib/cloudinary';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const result = await new Promise<unknown>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'uploads' },
        (error: unknown, result: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Upload error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
