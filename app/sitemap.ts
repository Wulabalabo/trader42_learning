import type { MetadataRoute } from 'next';

import { getAllIndicators } from '@/lib/indicators';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const indicators = await getAllIndicators();

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/indicators`, lastModified: new Date() },
    ...indicators.map((indicator) => ({
      url: `${baseUrl}/indicators/${indicator.slug}`,
      lastModified: new Date(),
    })),
  ];
}
