import { describe, expect, it, vi } from 'vitest';

import { fredProvider } from './fred-provider';

describe('fredProvider', () => {
  it('fetches and normalizes history from a series key', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2024-01-01', value: '100.1' },
          { date: '2024-02-01', value: '101.2' },
        ],
      }),
    });

    await expect(fredProvider.getHistory({ seriesKey: 'CPIAUCNS', apiKey: 'demo-key', fetchImpl })).resolves.toEqual([
      { date: '2024-01-01', value: 100.1 },
      { date: '2024-02-01', value: 101.2 },
    ]);
  });

  it('returns undefined when the upstream request fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await expect(fredProvider.getHistory({ seriesKey: 'CPIAUCNS', apiKey: 'demo-key', fetchImpl })).resolves.toBeUndefined();
  });
});
