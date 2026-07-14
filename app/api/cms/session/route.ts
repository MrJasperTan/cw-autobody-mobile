import { NextRequest, NextResponse } from 'next/server';
import {
  clearCmsSession,
  cmsPasswordConfigured,
  createCmsSession,
  isCmsAuthenticated,
  verifyCmsPassword,
} from '@/lib/cms-auth';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    authenticated: await isCmsAuthenticated(),
    passwordConfigured: cmsPasswordConfigured(),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';

  if (!cmsPasswordConfigured()) {
    return NextResponse.json(
      { error: 'CMS_OWNER_PASSWORD is required before the CMS can be used in production.' },
      { status: 503 },
    );
  }

  if (!verifyCmsPassword(password)) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  await createCmsSession();

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearCmsSession();

  return NextResponse.json({ authenticated: false });
}
