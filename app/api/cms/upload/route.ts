import crypto from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import { isCmsAuthenticated } from '@/lib/cms-auth';
import { hasR2Storage, putR2Object } from '@/lib/r2-storage';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const optimizeImage = async (file: File) => {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Only JPG, PNG, WEBP, HEIC, and HEIF images are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Images must be 8 MB or smaller.');
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  return sharp(bytes, { failOn: 'error' })
    .rotate()
    .resize({ width: 1800, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toBuffer();
};

export async function POST(request: NextRequest) {
  if (!(await isCmsAuthenticated())) {
    return NextResponse.json({ error: 'Owner login required.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose an image file to upload.' }, { status: 400 });
  }

  try {
    const optimizedImage = await optimizeImage(file);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.webp`;

    if (hasR2Storage()) {
      const src = await putR2Object({
        key: `cms/uploads/${filename}`,
        body: optimizedImage,
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000, immutable',
      });

      return NextResponse.json({ src, originalSize: file.size, optimizedSize: optimizedImage.length });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cms');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), optimizedImage);

    return NextResponse.json({
      src: `/uploads/cms/${filename}`,
      originalSize: file.size,
      optimizedSize: optimizedImage.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Image upload failed.' },
      { status: 400 },
    );
  }
}
