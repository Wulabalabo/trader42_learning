import { describe, expect, it } from 'vitest';

import type { Indicator } from './indicator-types';

import { getThemeBySlug, getThemeHref, getThemeSeedBySlug } from './theme-data';

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
    const theme = await getThemeBySlug('inflation', {
      loadIndicator: async (slug) => createIndicator(slug, slug === 'cpi' ? 9.9 : 1, 'FRED'),
    });

    expect(theme?.indicators.find((indicator) => indicator.slug === 'cpi')?.history.at(-1)?.value).toBe(9.9);
    expect(theme?.indicators.find((indicator) => indicator.slug === 'cpi')?.historySource).toBe('FRED');
  });

  it('exposes future-oriented market hrefs', () => {
    expect(getThemeHref('growth')).toBe('/markets/us/growth');
    expect(getThemeSeedBySlug('policy')?.navLabel).toBe('央行政策');
  });
});
