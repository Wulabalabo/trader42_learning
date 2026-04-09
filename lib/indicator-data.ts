import { unstable_cache } from 'next/cache';

import { getProviderAdapter } from './data-providers/provider-registry';
import type { Indicator } from './indicator-types';
import { getSeedIndicatorBySlug } from './indicators';

function normalizeHistoryForIndicator(indicator: Indicator, history: Indicator['history']) {
  if (indicator.slug === 'nonfarm-payrolls') {
    return history.slice(1).map((point, index) => ({
      date: point.date,
      value: Number((point.value - history[index].value).toFixed(1)),
    }));
  }

  if (indicator.slug === 'jolts-job-openings') {
    return history.map((point) => ({
      date: point.date,
      value: Number((point.value / 1000).toFixed(1)),
    }));
  }

  if (indicator.slug === 'initial-jobless-claims' || indicator.slug === 'continuing-jobless-claims') {
    return history.map((point) => ({
      date: point.date,
      value: Number((point.value / 1000).toFixed(0)),
    }));
  }

  if (indicator.slug === 'retail-sales') {
    return history.map((point) => ({
      date: point.date,
      value: Number((point.value / 1000).toFixed(1)),
    }));
  }

  return history;
}

type IndicatorDataOptions = {
  apiKey?: string;
  fetchImpl?: typeof fetch;
};

export async function getIndicatorDataBySlug(
  slug: string,
  { apiKey = process.env.FRED_API_KEY, fetchImpl = fetch }: IndicatorDataOptions = {},
): Promise<Indicator | undefined> {
  const indicator = getSeedIndicatorBySlug(slug);

  if (!indicator) {
    return undefined;
  }

  const provider = getProviderAdapter(indicator.dataProvider);

  if (!provider || !indicator.seriesKey) {
    return {
      ...indicator,
      historySource: '样本数据',
    };
  }

  try {
    if (provider.getSnapshot) {
      const latestSnapshot = await provider.getSnapshot({ seriesKey: indicator.seriesKey, apiKey, fetchImpl });

      return {
        ...indicator,
        latestSnapshot,
        historySource: '样本数据',
      };
    }

    const history = await provider.getHistory({ seriesKey: indicator.seriesKey, apiKey, fetchImpl });

    if (!history?.length) {
      return {
        ...indicator,
        historySource: '样本数据',
      };
    }

    return {
      ...indicator,
      history: normalizeHistoryForIndicator(indicator, history),
      historySource: 'FRED',
    };
  } catch {
    return {
      ...indicator,
      historySource: '样本数据',
    };
  }
}

export async function getCachedIndicatorDataBySlug(slug: string): Promise<Indicator | undefined> {
  const seedIndicator = getSeedIndicatorBySlug(slug);

  if (!seedIndicator) {
    return undefined;
  }

  return unstable_cache(() => getIndicatorDataBySlug(slug), ['indicator-data', slug], {
    revalidate: seedIndicator.revalidateSeconds,
    tags: [`indicator:${slug}`],
  })();
}

export async function getCachedIndicatorDataBySlugSafe(slug: string): Promise<Indicator | undefined> {
  try {
    return await getCachedIndicatorDataBySlug(slug);
  } catch {
    return getIndicatorDataBySlug(slug);
  }
}
