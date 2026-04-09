import { revalidateTag } from 'next/cache';

import { getSeedIndicators } from './indicators';

export function getIndicatorRevalidationTags(slug?: string) {
  if (slug) {
    return [`indicator:${slug}`];
  }

  return getSeedIndicators().map((indicator) => `indicator:${indicator.slug}`);
}

export function revalidateIndicatorTags(slug?: string) {
  const tags = getIndicatorRevalidationTags(slug);

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  return tags;
}
