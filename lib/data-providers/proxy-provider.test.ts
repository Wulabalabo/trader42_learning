import { describe, expect, it, vi } from 'vitest';

import { aktoolsProvider } from './aktools-provider';
import { openbbProvider } from './openbb-provider';

describe('proxy-backed providers', () => {
  it('calls the openbb proxy with bearer auth', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await openbbProvider.getHistory({
      seriesKey: 'api/v1/equity/price/historical?symbol=AAPL',
      apiKey: 'proxy-token',
      fetchImpl,
      baseUrl: 'http://127.0.0.1:8088',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://127.0.0.1:8088/openbb/api/v1/equity/price/historical?symbol=AAPL',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer proxy-token',
        }),
      }),
    );
  });

  it('calls the aktools proxy with bearer auth', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await aktoolsProvider.getHistory({
      seriesKey: 'api/public/stock_zh_a_hist?symbol=000001',
      apiKey: 'proxy-token',
      fetchImpl,
      baseUrl: 'http://127.0.0.1:8088',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://127.0.0.1:8088/aktools/api/public/stock_zh_a_hist?symbol=000001',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer proxy-token',
        }),
      }),
    );
  });

  it('skips proxy requests when the proxy base URL is missing', async () => {
    const fetchImpl = vi.fn();

    await openbbProvider.getHistory({
      seriesKey: 'api/v1/equity/price/historical?symbol=AAPL',
      apiKey: 'proxy-token',
      fetchImpl,
      baseUrl: undefined,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
