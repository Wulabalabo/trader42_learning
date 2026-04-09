import type { IndicatorDataProvider, IndicatorHistoryPoint } from '@/lib/indicator-types';

export type ProviderHistoryArgs = {
  seriesKey: string;
  apiKey?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
};

export type ProviderSnapshot = {
  value: number;
  previousValue?: number;
  periodLabel: string;
  releaseLabel?: string;
  sourceLabel: string;
};

export interface IndicatorDataProviderAdapter {
  key: IndicatorDataProvider;
  getHistory(args: ProviderHistoryArgs): Promise<IndicatorHistoryPoint[] | undefined>;
  getSnapshot?(args: ProviderHistoryArgs): Promise<ProviderSnapshot | undefined>;
}
