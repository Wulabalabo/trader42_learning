import { describe, expect, it } from 'vitest';

import { getProviderAdapter } from './provider-registry';

describe('provider registry', () => {
  it('resolves the fred adapter', () => {
    expect(getProviderAdapter('fred')?.key).toBe('fred');
  });

  it('resolves placeholder adapters for openbb and aktools', () => {
    expect(getProviderAdapter('openbb')?.key).toBe('openbb');
    expect(getProviderAdapter('aktools')?.key).toBe('aktools');
  });
});
