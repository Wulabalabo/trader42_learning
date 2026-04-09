import { NextResponse } from 'next/server';

import { revalidateIndicatorTags } from '@/lib/indicator-refresh';

type RevalidateRequestBody = {
  token?: string;
  slug?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RevalidateRequestBody;

  if (!process.env.INDICATOR_REVALIDATE_TOKEN || body.token !== process.env.INDICATOR_REVALIDATE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const tags = revalidateIndicatorTags(body.slug);

  return NextResponse.json({ ok: true, tags });
}
