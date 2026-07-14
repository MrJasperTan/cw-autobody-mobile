import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const getR2Config = () => {
  const accountId = process.env.R2_ACCOUNT_ID?.replace(/\.$/, '');
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
};

export const hasR2Storage = () => Boolean(getR2Config());

const getR2Client = () => {
  const config = getR2Config();

  if (!config) {
    return null;
  }

  return {
    config,
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
  };
};

export const putR2Object = async ({
  key,
  body,
  contentType,
  cacheControl,
}: {
  key: string;
  body: string | Buffer;
  contentType: string;
  cacheControl?: string;
}) => {
  const r2 = getR2Client();

  if (!r2) {
    return null;
  }

  await r2.client.send(new PutObjectCommand({
    Bucket: r2.config.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  }));

  return `${r2.config.publicBaseUrl}/${key}`;
};
