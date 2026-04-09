import type { IndicatorDataProviderAdapter } from './types';
import { fetchProxyHistory } from './proxy-provider';

export const openbbProvider: IndicatorDataProviderAdapter = {
  key: 'openbb',
  async getHistory(args) {
    return fetchProxyHistory('openbb', args);
  },
};
