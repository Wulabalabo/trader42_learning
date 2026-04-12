import eurozoneGrowthTheme from '@/data/themes/eurozone-growth.json';
import eurozoneInflationTheme from '@/data/themes/eurozone-inflation.json';
import eurozoneLaborTheme from '@/data/themes/eurozone-labor.json';
import eurozonePolicyTheme from '@/data/themes/eurozone-policy.json';
import chinaDemandTheme from '@/data/themes/china-demand.json';
import chinaCreditTheme from '@/data/themes/china-credit.json';
import chinaPolicyTheme from '@/data/themes/china-policy.json';
import chinaCommoditiesTheme from '@/data/themes/china-commodities.json';
import growthTheme from '@/data/themes/us-growth.json';
import inflationTheme from '@/data/themes/us-inflation.json';
import laborTheme from '@/data/themes/us-labor.json';
import policyTheme from '@/data/themes/us-policy.json';

import type { MarketSlug, MarketTheme } from './indicator-types';
import { getIndicatorDataBySlug } from './indicator-data';
import { getSeedIndicatorBySlug } from './indicators';

type MarketThemeSeed = Omit<MarketTheme, 'indicators'>;

const themeSeedsByMarket: Record<MarketSlug, MarketThemeSeed[]> = {
  us: [inflationTheme, laborTheme, policyTheme, growthTheme] as MarketThemeSeed[],
  eurozone: [eurozoneInflationTheme, eurozonePolicyTheme, eurozoneGrowthTheme, eurozoneLaborTheme] as MarketThemeSeed[],
  china: [chinaDemandTheme, chinaCreditTheme, chinaPolicyTheme, chinaCommoditiesTheme] as MarketThemeSeed[],
};

export function getAllThemeSeeds(market: MarketSlug) {
  return themeSeedsByMarket[market];
}

export function getThemeSeedBySlug(market: MarketSlug, slug: string) {
  return getAllThemeSeeds(market).find((theme) => theme.slug === slug);
}

type ThemeDataOptions = {
  loadIndicator?: (slug: string) => Promise<ReturnType<typeof getSeedIndicatorBySlug> | Awaited<ReturnType<typeof getIndicatorDataBySlug>>>;
};

export async function getThemeBySlug(
  market: MarketSlug,
  slug: string,
  { loadIndicator = getIndicatorDataBySlug }: ThemeDataOptions = {},
): Promise<MarketTheme | undefined> {
  const seed = getThemeSeedBySlug(market, slug);

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

export function getThemeHref(market: MarketSlug, slug: string) {
  return `/markets/${market}/${slug}`;
}

export function getThemeIndicatorSeeds(market: MarketSlug, slug: string) {
  const seed = getThemeSeedBySlug(market, slug);

  if (!seed) {
    return [];
  }

  return seed.indicatorSlugs.map((indicatorSlug) => getSeedIndicatorBySlug(indicatorSlug)).filter(Boolean);
}
