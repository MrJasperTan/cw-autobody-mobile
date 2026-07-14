import { NextRequest, NextResponse } from 'next/server';
import { isCmsAuthenticated } from '@/lib/cms-auth';
import { getCmsContent, saveCmsContent } from '@/lib/cms-content';

export const runtime = 'nodejs';

const unauthorized = () =>
  NextResponse.json({ error: 'Owner login required.' }, { status: 401 });

export async function GET() {
  if (!(await isCmsAuthenticated())) {
    return unauthorized();
  }

  return NextResponse.json(await getCmsContent());
}

export async function PUT(request: NextRequest) {
  if (!(await isCmsAuthenticated())) {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  try {
    const content = await saveCmsContent(body);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save CMS content.' },
      { status: 400 },
    );
  }
}
