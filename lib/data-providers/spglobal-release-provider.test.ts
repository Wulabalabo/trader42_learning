import { describe, expect, it, vi } from 'vitest';

import { spGlobalReleaseProvider } from './spglobal-release-provider';

describe('spGlobalReleaseProvider', () => {
  it('extracts the latest and previous services PMI values from public pages', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('tradingeconomics.com')) {
        return {
          ok: true,
          text: async () =>
            'Services PMI in the United States decreased to 49.80 points in March from 51.70 points in February of 2026.',
        } as Response;
      }

      return {
        ok: true,
        text: async () =>
          'April 03 2026 13:45 UTC S&P Global US Services PMI View More',
      } as Response;
    });

    await expect(spGlobalReleaseProvider.getSnapshot?.({ seriesKey: 'us-services-pmi', fetchImpl: fetchImpl as typeof fetch })).resolves.toEqual({
      periodLabel: '2026-03',
      previousValue: 51.7,
      releaseLabel: '2026-04-03',
      sourceLabel: 'S&P Global 官方发布（最新值）',
      value: 49.8,
    });
  });
});
