import { describe, expect, it, vi } from 'vitest';

import { getIndicatorDataBySlug } from './indicator-data';

describe('indicator data service', () => {
  it('loads only the requested indicator through the unified service', async () => {
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

  it('falls back to sample history when upstream data is unavailable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    const indicator = await getIndicatorDataBySlug('cpi', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.historySource).toBe('样本数据');
    expect(indicator?.history.length).toBeGreaterThan(0);
  });

  it('falls back to sample data when snapshot providers throw', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network down'));

    const indicator = await getIndicatorDataBySlug('ism-services-pmi', { fetchImpl: fetchImpl as typeof fetch });

    expect(indicator?.historySource).toBe('样本数据');
    expect(indicator?.latestSnapshot).toBeUndefined();
    expect(indicator?.history.length).toBeGreaterThan(0);
  });

  it('keeps CPI live history in raw index points', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
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
    });

    const indicator = await getIndicatorDataBySlug('cpi', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.historySource).toBe('FRED');
    expect(indicator?.history.at(-1)).toEqual({ date: '2026-01-01', value: 325.52 });
  });

  it('normalizes JOLTS history from thousands to millions', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2025-11-01', value: '8460.0' },
          { date: '2025-12-01', value: '8400.0' },
          { date: '2026-01-01', value: '7300.0' },
        ],
      }),
    });

    const indicator = await getIndicatorDataBySlug('jolts-job-openings', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.historySource).toBe('FRED');
    expect(indicator?.history.at(-1)).toEqual({ date: '2026-01-01', value: 7.3 });
  });

  it('normalizes initial claims history from people to thousands of people', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2026-01-03', value: '211000' },
          { date: '2026-01-10', value: '202000' },
        ],
      }),
    });

    const indicator = await getIndicatorDataBySlug('initial-jobless-claims', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.historySource).toBe('FRED');
    expect(indicator?.history.at(-1)).toEqual({ date: '2026-01-10', value: 202 });
  });

  it('normalizes continuing claims history from people to thousands of people', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        observations: [
          { date: '2026-01-10', value: '1816000' },
          { date: '2026-01-17', value: '1841000' },
        ],
      }),
    });

    const indicator = await getIndicatorDataBySlug('continuing-jobless-claims', { apiKey: 'demo-key', fetchImpl });

    expect(indicator?.historySource).toBe('FRED');
    expect(indicator?.history.at(-1)).toEqual({ date: '2026-01-17', value: 1841 });
  });

  it('returns undefined for unknown slugs', async () => {
    await expect(getIndicatorDataBySlug('not-a-real-indicator')).resolves.toBeUndefined();
  });

  it('merges the latest S&P services PMI snapshot into the indicator while keeping sample history', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('tradingeconomics.com')) {
        return {
          ok: true,
          text: async () => 'Services PMI in the United States decreased to 49.80 points in March from 51.70 points in February of 2026.',
        } as Response;
      }

      return {
        ok: true,
        text: async () => 'April 03 2026 13:45 UTC S&P Global US Services PMI View More',
      } as Response;
    });

    const indicator = await getIndicatorDataBySlug('ism-services-pmi', { fetchImpl: fetchImpl as typeof fetch });

    expect(indicator?.historySource).toBe('样本数据');
    expect(indicator?.latestSnapshot).toEqual({
      value: 49.8,
      previousValue: 51.7,
      periodLabel: '2026-03',
      releaseLabel: '2026-04-03',
      sourceLabel: 'S&P Global 官方发布（最新值）',
    });
  });

  it('loads ISM manufacturing PMI latest snapshot from the TradingEconomics public page', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => 'Business Confidence in the United States increased to 52.70 points in March from 52.40 points in February of 2026.',
    });

    const indicator = await getIndicatorDataBySlug('ism-pmi', { fetchImpl: fetchImpl as typeof fetch });

    expect(indicator?.latestSnapshot).toEqual({
      value: 52.7,
      previousValue: 52.4,
      periodLabel: '2026-03',
      sourceLabel: 'TradingEconomics 公共页（最新值）',
    });
  });
});
