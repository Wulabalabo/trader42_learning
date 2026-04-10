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

  it('extracts percent-based readings from a TradingEconomics indicator page', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        'Core consumer prices In the Euro Area increased 2.30 percent in March of 2026 over the same month in the previous year. Core Inflation Rate in Euro Area was 2.40 percent in February of 2026.',
    });

    await expect(
      tradingEconomicsPageProvider.getSnapshot?.({ seriesKey: 'euro-area/core-inflation-rate', fetchImpl: fetchImpl as typeof fetch }),
    ).resolves.toEqual({
      value: 2.3,
      previousValue: 2.4,
      periodLabel: '2026-03',
      sourceLabel: 'TradingEconomics 公共页（最新值）',
    });
  });
});
