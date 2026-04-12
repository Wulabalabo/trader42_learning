import { describe, expect, it } from 'vitest';

import type { Indicator } from './indicator-types';

import { getAllThemeSeeds, getThemeBySlug, getThemeHref, getThemeSeedBySlug } from './theme-data';

function createIndicator(slug: string, value = 1, historySource?: Indicator['historySource']): Indicator {
  return {
    slug,
    title: slug,
    category: '通胀',
    summary: slug,
    historyUnit: '%',
    status: 'live',
    priority: 'P1',
    templateKey: 'inflation',
    navGroup: '通胀指标',
    dataProvider: 'fred',
    revalidateSeconds: 86400,
    releaseCadence: '每月',
    updatedAt: '2026-04-08',
    scopes: ['美国'],
    sourceLabel: 'test',
    currentAssessment: { level: 'Medium', reason: 'test' },
    whyItMatters: 'test',
    whatItMeans: [],
    cannotTell: [],
    marketImpact: [],
    history: [{ date: '2026-01', value }],
    historyNote: 'test',
    historySource,
  };
}

describe('theme data', () => {
  it('uses the provided loader so theme values can match detail-page data', async () => {
    const theme = await getThemeBySlug('us', 'inflation', {
      loadIndicator: async (slug) => createIndicator(slug, slug === 'cpi' ? 9.9 : 1, 'FRED'),
    });

    expect(theme?.indicators.find((indicator) => indicator.slug === 'cpi')?.history.at(-1)?.value).toBe(9.9);
    expect(theme?.indicators.find((indicator) => indicator.slug === 'cpi')?.historySource).toBe('FRED');
  });

  it('looks up theme seeds and hrefs by market', () => {
    expect(getThemeHref('us', 'growth')).toBe('/markets/us/growth');
    expect(getThemeHref('eurozone', 'inflation')).toBe('/markets/eurozone/inflation');
    expect(getThemeHref('china', 'demand')).toBe('/markets/china/demand');
    expect(getThemeSeedBySlug('us', 'policy')?.navLabel).toBe('央行政策');
    expect(getThemeSeedBySlug('eurozone', 'policy')?.navLabel).toBe('欧洲央行政策');
    expect(getThemeSeedBySlug('china', 'demand')?.navLabel).toBe('增长与内需');
    expect(getThemeSeedBySlug('china', 'credit')?.navLabel).toBe('地产与信用脉冲');
    expect(getThemeSeedBySlug('china', 'policy')?.navLabel).toBe('政策托底与汇率');
    expect(getThemeSeedBySlug('china', 'commodities')?.navLabel).toBe('商品需求与区域传导');
  });

  it('returns four china theme seeds', () => {
    const seeds = getAllThemeSeeds('china');

    expect(seeds).toHaveLength(4);
    expect(seeds.map((s) => s.slug)).toContain('demand');
    expect(seeds.map((s) => s.slug)).toContain('credit');
    expect(seeds.map((s) => s.slug)).toContain('policy');
    expect(seeds.map((s) => s.slug)).toContain('commodities');
    expect(seeds.every((s) => s.market === 'china')).toBe(true);
  });
});
