// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  return NextResponse.json(result);
}
