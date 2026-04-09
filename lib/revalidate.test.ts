import { describe, expect, it } from 'vitest';

import { revalidate as homeRevalidate } from '@/app/page';
import { revalidate as indicatorsRevalidate } from '@/app/indicators/page';
import { revalidate as detailRevalidate } from '@/app/indicators/[slug]/page';

describe('revalidation policy', () => {
  it('uses a 24 hour refresh interval everywhere', () => {
    expect(homeRevalidate).toBe(86400);
    expect(indicatorsRevalidate).toBe(86400);
    expect(detailRevalidate).toBe(86400);
  });
});
