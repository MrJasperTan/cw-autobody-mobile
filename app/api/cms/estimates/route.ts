import { NextRequest, NextResponse } from 'next/server';
import { isCmsAuthenticated } from '@/lib/cms-auth';
import { EstimateStatus, listEstimates, updateEstimateStatus } from '@/lib/estimates';

export const runtime = 'nodejs';

const statuses = new Set<EstimateStatus>(['new', 'reviewing', 'scheduled', 'completed', 'archived']);

const unauthorized = () =>
  NextResponse.json({ error: 'Owner login required.' }, { status: 401 });

export async function GET() {
  if (!(await isCmsAuthenticated())) {
    return unauthorized();
  }

  return NextResponse.json(await listEstimates());
}

export async function PATCH(request: NextRequest) {
  if (!(await isCmsAuthenticated())) {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : '';
  const status = typeof body.status === 'string' ? body.status as EstimateStatus : 'new';

  if (!id || !statuses.has(status)) {
    return NextResponse.json({ error: 'Valid estimate id and status are required.' }, { status: 400 });
  }

  await updateEstimateStatus(id, status);

  return NextResponse.json({ ok: true });
}
