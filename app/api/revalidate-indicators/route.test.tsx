import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

describe('revalidate indicators route', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.INDICATOR_REVALIDATE_TOKEN = 'secret-token';
  });

  it('rejects requests with the wrong token', async () => {
    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/revalidate-indicators', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: 'wrong-token', slug: 'cpi' }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it('revalidates the requested indicator tag', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await import('./route');

    const response = await POST(
      new Request('http://localhost/api/revalidate-indicators', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: 'secret-token', slug: 'cpi' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('indicator:cpi', 'max');
  });
});
