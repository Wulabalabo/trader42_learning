import { describe, expect, it, vi } from 'vitest';

import { tradingEconomicsPageProvider } from './tradingeconomics-page-provider';

describe('tradingEconomicsPageProvider', () => {
  it('extracts latest and previous values from a TradingEconomics indicator page', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        'Business Confidence in the United States increased to 52.70 points in March from 52.40 points in February of 2026.',
    });

    await expect(
      tradingEconomicsPageProvider.getSnapshot?.({ seriesKey: 'united-states/business-confidence', fetchImpl: fetchImpl as typeof fetch }),
    ).resolves.toEqual({
      value: 52.7,
      previousValue: 52.4,
      periodLabel: '2026-03',
      sourceLabel: 'TradingEconomics 公共页（最新值）',
    });
  });
});
