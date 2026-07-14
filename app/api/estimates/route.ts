import crypto from 'crypto';
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import { createEstimateFromForm } from '@/lib/estimates';
import { hasR2Storage, putR2Object } from '@/lib/r2-storage';

export const runtime = 'nodejs';

const MAX_FILES = 8;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const IMAGE_EXTENSION = /\.(?:avif|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;

const submissionResponse = ({
  acceptsJson,
  requestUrl,
  error,
  status,
}: {
  acceptsJson: boolean | undefined;
  requestUrl: string;
  error: string;
  status: 'error' | 'photo-error';
}) => {
  if (acceptsJson) {
    return NextResponse.json({ error }, { status: status === 'photo-error' ? 400 : 500 });
  }

  return NextResponse.redirect(new URL(`/?estimate=${status}#quote`, requestUrl), 303);
};

const uploadDamageImage = async (file: File) => {
  const isRasterImage = file.type.startsWith('image/') && file.type !== 'image/svg+xml';
  if (!isRasterImage && !IMAGE_EXTENSION.test(file.name)) {
    throw new Error('The selected file is not a supported vehicle-damage image.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Each image must be 8 MB or smaller.');
  }

  if (!hasR2Storage()) {
    throw new Error('R2 storage is required for estimate image uploads.');
  }

  let optimizedImage: Buffer;

  try {
    optimizedImage = await sharp(Buffer.from(await file.arrayBuffer()), { failOn: 'error' })
      .rotate()
      .resize({ width: 1800, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toBuffer();
  } catch {
    throw new Error(`${file.name || 'One photo'} could not be decoded. Try exporting it as JPG or PNG.`);
  }

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.webp`;
  const url = await putR2Object({
    key: `estimates/${filename}`,
    body: optimizedImage,
    contentType: 'image/webp',
    cacheControl: 'private, max-age=31536000',
  });

  if (!url) {
    throw new Error('R2 storage is not configured.');
  }

  return url;
};

export async function POST(request: NextRequest) {
  const acceptsJson = request.headers.get('accept')?.includes('application/json');

  try {
    const formData = await request.formData();
    const files = formData
      .getAll('damagePhotos')
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, MAX_FILES);

    if (!files.length) {
      return submissionResponse({
        acceptsJson,
        requestUrl: request.url,
        error: 'At least one damage photo is required.',
        status: 'photo-error',
      });
    }

    const uploadResults = await Promise.allSettled(files.map(uploadDamageImage));
    const imageUrls = uploadResults.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : [],
    );
    const uploadFailures = uploadResults.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (!imageUrls.length) {
      console.error('Estimate rejected because no photo could be processed:', uploadFailures.map(({ reason }) => reason));
      return submissionResponse({
        acceptsJson,
        requestUrl: request.url,
        error: 'No damage photo could be processed. Use an image up to 8 MB, or export it as JPG or PNG.',
        status: 'photo-error',
      });
    }

    await createEstimateFromForm(formData, imageUrls);

    if (uploadFailures.length) {
      console.error('Estimate saved with photo upload failures:', uploadFailures.map(({ reason }) => reason));
    }

    if (acceptsJson) {
      return NextResponse.json({
        ok: true,
        photoWarning: uploadFailures.length > 0,
      });
    }

    const resultUrl = new URL('/?estimate=sent#quote', request.url);
    if (uploadFailures.length) {
      resultUrl.searchParams.set('photos', 'partial');
      resultUrl.hash = 'quote';
    }

    return NextResponse.redirect(resultUrl, 303);
  } catch (error) {
    console.error('Estimate request failed:', error);
    const publicMessage = 'We could not save the request. Please call or text 480-300-9022.';
    return submissionResponse({
      acceptsJson,
      requestUrl: request.url,
      error: publicMessage,
      status: 'error',
    });
  }
}
