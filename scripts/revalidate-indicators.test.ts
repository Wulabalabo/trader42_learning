import { describe, expect, it, vi } from 'vitest';

import { revalidateIndicators } from './revalidate-indicators';

describe('revalidateIndicators', () => {
  it('posts token and slug to the revalidate endpoint', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true, tags: ['indicator:cpi'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await revalidateIndicators({
      baseUrl: 'https://example.com',
      token: 'secret-token',
      slug: 'cpi',
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://example.com/api/revalidate-indicators',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'secret-token', slug: 'cpi' }),
      }),
    );
    expect(result).toEqual({ ok: true, tags: ['indicator:cpi'] });
  });

  it('omits slug when refreshing all indicators', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true, tags: ['indicator:cpi', 'indicator:ppi'] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await revalidateIndicators({
      baseUrl: 'https://example.com/',
      token: 'secret-token',
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://example.com/api/revalidate-indicators',
      expect.objectContaining({
        body: JSON.stringify({ token: 'secret-token' }),
      }),
    );
  });

  it('throws a readable error when the endpoint rejects the request', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      revalidateIndicators({
        baseUrl: 'https://example.com',
        token: 'bad-token',
        fetchImpl,
      }),
    ).rejects.toThrow('Revalidation failed (401): unauthorized');
  });
});
