import type { IndicatorDataProviderAdapter } from './types';
import { fetchProxyHistory } from './proxy-provider';

export const aktoolsProvider: IndicatorDataProviderAdapter = {
  key: 'aktools',
  async getHistory(args) {
    return fetchProxyHistory('aktools', args);
  },
};
