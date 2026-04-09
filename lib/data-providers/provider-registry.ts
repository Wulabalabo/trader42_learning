import type { IndicatorDataProvider } from '@/lib/indicator-types';

import { aktoolsProvider } from './aktools-provider';
import { fredProvider } from './fred-provider';
import { openbbProvider } from './openbb-provider';
import { spGlobalReleaseProvider } from './spglobal-release-provider';
import { tradingEconomicsPageProvider } from './tradingeconomics-page-provider';
import type { IndicatorDataProviderAdapter } from './types';

const registry: Partial<Record<IndicatorDataProvider, IndicatorDataProviderAdapter>> = {
  aktools: aktoolsProvider,
  fred: fredProvider,
  openbb: openbbProvider,
  'spglobal-release': spGlobalReleaseProvider,
  'tradingeconomics-page': tradingEconomicsPageProvider,
};

export function getProviderAdapter(provider: IndicatorDataProvider) {
  return registry[provider];
}
