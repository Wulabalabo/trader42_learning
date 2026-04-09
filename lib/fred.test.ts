import { describe, expect, it, vi } from 'vitest';

import { buildFredObservationsUrl, fetchFredSeriesHistory, parseFredObservations } from './fred';

describe('FRED helpers', () => {
  it('builds a series observations url with the api key', () => {
    expect(buildFredObservationsUrl('CPIAUCSL', 'demo-key')).toBe(
      'https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=demo-key&file_type=json&sort_order=asc',
    );
  });

  it('parses FRED observations into history points', () => {
    expect(
      parseFredObservations([
        { date: '2024-01-01', value: '3.1' },
        { date: '2024-02-01', value: '.' },
        { date: '2024-03-01', value: '3.4' },
      ]),
    ).toEqual([
      { date: '2024-01-01', value: 3.1 },
      { date: '2024-03-01', value: 3.4 },
    ]);
  });

  it('fetches and normalizes series observations', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2024-01-01', value: '123.4' },
          { date: '2024-02-01', value: '124.1' },
        ],
      }),
    });

    await expect(fetchFredSeriesHistory('CPIAUCSL', 'demo-key', fetchImpl)).resolves.toEqual([
      { date: '2024-01-01', value: 123.4 },
      { date: '2024-02-01', value: 124.1 },
    ]);
  });
});
