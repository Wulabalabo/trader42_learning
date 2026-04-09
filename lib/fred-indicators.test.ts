import { describe, expect, it, vi } from 'vitest';

import { getIndicatorDataBySlug } from './indicator-data';
import { buildIndicators } from './indicators';

describe('indicator loading from FRED', () => {
  it('keeps ISM manufacturing sample history when it now uses a public-page snapshot provider', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [{ date: '2024-01-01', value: '55.2' }],
      }),
    });

    const indicators = await buildIndicators({ apiKey: 'demo-key', fetchImpl });
    const pmi = indicators.find((indicator) => indicator.slug === 'ism-pmi');

    expect(pmi?.historySource).toBe('样本数据');
    expect(pmi?.history.at(-1)).toEqual({ date: '2025-01', value: 50.1 });
  });

  it('loads CPI as raw index points when using live FRED history', async () => {
    const fetchImpl = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('CPIAUCNS')) {
        return {
          ok: true,
          json: async () => ({
            observations: [
              { date: '2025-01-01', value: '313.000' },
              { date: '2025-02-01', value: '314.000' },
              { date: '2025-03-01', value: '315.000' },
              { date: '2025-04-01', value: '316.000' },
              { date: '2025-05-01', value: '317.000' },
              { date: '2025-06-01', value: '318.000' },
              { date: '2025-07-01', value: '319.000' },
              { date: '2025-08-01', value: '320.000' },
              { date: '2025-09-01', value: '321.000' },
              { date: '2025-10-01', value: '322.000' },
              { date: '2025-11-01', value: '323.000' },
              { date: '2025-12-01', value: '324.000' },
              { date: '2026-01-01', value: '325.520' },
            ],
          }),
        };
      }

      return {
        ok: true,
        json: async () => ({ observations: [] }),
      };
    });

    const indicators = await buildIndicators({ apiKey: 'demo-key', fetchImpl });
    const cpi = indicators.find((indicator) => indicator.slug === 'cpi');

    expect(cpi?.history.at(-1)).toEqual({ date: '2026-01-01', value: 325.52 });
  });

  it('loads only the requested indicator history for detail pages', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [{ date: '2024-01-01', value: '324.0' }],
      }),
    });

    const indicator = await getIndicatorDataBySlug('cpi', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.slug).toBe('cpi');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[0]).toContain('series_id=CPIAUCNS');
  });

  it('normalizes retail sales from FRED millions into site display units', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2024-01-01', value: '700600.0' },
          { date: '2024-02-01', value: '709800.0' },
        ],
      }),
    });

    const indicator = await getIndicatorDataBySlug('retail-sales', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.history).toEqual([
      { date: '2024-01-01', value: 700.6 },
      { date: '2024-02-01', value: 709.8 },
    ]);
  });
});
