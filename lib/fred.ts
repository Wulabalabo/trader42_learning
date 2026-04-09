import type { IndicatorHistoryPoint } from './indicator-types';

export type FredObservation = {
  date: string;
  value: string;
};

type FredSeriesResponse = {
  observations?: FredObservation[];
};

export function buildFredObservationsUrl(seriesId: string, apiKey: string) {
  return `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(seriesId)}&api_key=${encodeURIComponent(apiKey)}&file_type=json&sort_order=asc`;
}

export function parseFredObservations(observations: FredObservation[]): IndicatorHistoryPoint[] {
  return observations
    .map((observation) => ({ date: observation.date, value: Number(observation.value) }))
    .filter((observation) => Number.isFinite(observation.value));
}

export async function fetchFredSeriesHistory(
  seriesId: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<IndicatorHistoryPoint[] | undefined> {
  if (!apiKey) {
    return undefined;
  }

  try {
    const response = await fetchImpl(buildFredObservationsUrl(seriesId, apiKey));

    if (!response.ok) {
      return undefined;
    }

    const data = (await response.json()) as FredSeriesResponse;

    if (!data.observations) {
      return undefined;
    }

    return parseFredObservations(data.observations);
  } catch {
    return undefined;
  }
}
