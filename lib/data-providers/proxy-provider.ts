import type { ProviderHistoryArgs } from './types';

export function buildProxyUrl(baseUrl: string, providerPath: 'openbb' | 'aktools', seriesKey: string) {
  return `${baseUrl.replace(/\/$/, '')}/${providerPath}/${seriesKey.replace(/^\//, '')}`;
}

export async function fetchProxyHistory(
  providerPath: 'openbb' | 'aktools',
  { seriesKey, apiKey = process.env.API_TOKEN, baseUrl = process.env.AUTH_PROXY_BASE_URL, fetchImpl = fetch }: ProviderHistoryArgs,
) {
  if (!apiKey || !baseUrl) {
    return undefined;
  }

  try {
    await fetchImpl(buildProxyUrl(baseUrl, providerPath, seriesKey), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  } catch {
    return undefined;
  }

  return undefined;
}
