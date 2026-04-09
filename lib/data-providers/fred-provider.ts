import { fetchFredSeriesHistory } from '@/lib/fred';

import type { IndicatorDataProviderAdapter } from './types';

export const fredProvider: IndicatorDataProviderAdapter = {
  key: 'fred',
  async getHistory({ seriesKey, apiKey = process.env.FRED_API_KEY, fetchImpl = fetch }) {
    if (!apiKey) {
      return undefined;
    }

    return fetchFredSeriesHistory(seriesKey, apiKey, fetchImpl);
  },
};
