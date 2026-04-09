type RevalidateResponse = {
  ok: boolean;
  tags?: string[];
  error?: string;
};

type RevalidateOptions = {
  baseUrl: string;
  token: string;
  slug?: string;
  fetchImpl?: typeof fetch;
};

const baseUrl = 'https://your-domain.vercel.app';

export async function revalidateIndicators({
  baseUrl,
  token,
  slug,
  fetchImpl = fetch,
}: RevalidateOptions): Promise<RevalidateResponse> {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const payload = slug ? { token, slug } : { token };
  const response = await fetchImpl(`${normalizedBaseUrl}/api/revalidate-indicators`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as RevalidateResponse;

  if (!response.ok || !data.ok) {
    throw new Error(`Revalidation failed (${response.status}): ${data.error ?? 'unknown error'}`);
  }

  return data;
}

async function main() {
  const token = process.env.INDICATOR_REVALIDATE_TOKEN;
  const slug = process.argv[2];

  if (!token) {
    throw new Error('Missing INDICATOR_REVALIDATE_TOKEN');
  }

  const result = await revalidateIndicators({ baseUrl, token, slug });
  console.log(`Revalidated ${result.tags?.length ?? 0} tag(s): ${result.tags?.join(', ') ?? ''}`);
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    process.exit(1);
  });
}
