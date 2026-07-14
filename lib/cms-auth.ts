import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cw_owner_cms';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const getSecret = () =>
  process.env.CMS_SESSION_SECRET ||
  process.env.CMS_OWNER_PASSWORD ||
  'cw-autobody-mobile-local-cms-secret';

const sign = (payload: string) =>
  crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');

const safeEqual = (a: string, b: string) => {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return first.length === second.length && crypto.timingSafeEqual(first, second);
};

export const cmsPasswordConfigured = () =>
  Boolean(process.env.CMS_OWNER_PASSWORD) || process.env.NODE_ENV !== 'production';

export const verifyCmsPassword = (password: string) => {
  const expected = process.env.CMS_OWNER_PASSWORD || 'cw-demo-owner';

  if (!expected || !password) {
    return false;
  }

  return safeEqual(password, expected);
};

export const createCmsSession = async () => {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
};

export const clearCmsSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const isCmsAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split('.');
  const expires = Number(expiresAt);

  if (!expires || Date.now() > expires || !signature) {
    return false;
  }

  return safeEqual(sign(expiresAt), signature);
};
