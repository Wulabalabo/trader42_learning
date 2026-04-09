import growthTheme from '@/data/themes/us-growth.json';
import inflationTheme from '@/data/themes/us-inflation.json';
import laborTheme from '@/data/themes/us-labor.json';
import policyTheme from '@/data/themes/us-policy.json';

import type { MarketTheme } from './indicator-types';
import { getIndicatorDataBySlug } from './indicator-data';
import { getSeedIndicatorBySlug } from './indicators';

type MarketThemeSeed = Omit<MarketTheme, 'indicators'>;

const themeSeeds = [inflationTheme, laborTheme, policyTheme, growthTheme] as MarketThemeSeed[];

export function getAllThemeSeeds() {
  return themeSeeds;
}

export function getThemeSeedBySlug(slug: string) {
  return themeSeeds.find((theme) => theme.slug === slug);
}

type ThemeDataOptions = {
  loadIndicator?: (slug: string) => Promise<ReturnType<typeof getSeedIndicatorBySlug> | Awaited<ReturnType<typeof getIndicatorDataBySlug>>>;
};

export async function getThemeBySlug(
  slug: string,
  { loadIndicator = getIndicatorDataBySlug }: ThemeDataOptions = {},
): Promise<MarketTheme | undefined> {
  const seed = getThemeSeedBySlug(slug);

  if (!seed) {
    return undefined;
  }

  const indicators = await Promise.all(seed.indicatorSlugs.map((indicatorSlug) => loadIndicator(indicatorSlug)));
  const resolvedIndicators = indicators.filter((indicator): indicator is NonNullable<typeof indicator> => Boolean(indicator));

  return {
    ...seed,
    indicators: resolvedIndicators,
  };
}

export function getThemeHref(slug: string) {
  return `/markets/us/${slug}`;
}

export function getThemeIndicatorSeeds(slug: string) {
  const seed = getThemeSeedBySlug(slug);

  if (!seed) {
    return [];
  }

  return seed.indicatorSlugs.map((indicatorSlug) => getSeedIndicatorBySlug(indicatorSlug)).filter(Boolean);
}
