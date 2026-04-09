import { getSeedIndicators } from './indicators';
import { getThemeHref } from './theme-data';

export const primaryNavigation = [
  { label: '首页', href: '/' },
  { label: '指标库', href: '/indicators' },
] as const;

export const siteScopes = [
  { label: '美国', isCurrent: true },
  { label: '中国', isCurrent: false },
  { label: '欧元区', isCurrent: false },
  { label: '日本', isCurrent: false },
  { label: 'Crypto', isCurrent: false },
] as const;

export const marketNavigation = [
  { label: '美国市场', href: '/markets/us', activeKey: 'us-market', isPlaceholder: false },
  { label: '中国市场', href: '/markets/china', activeKey: 'china-market', isPlaceholder: true },
  { label: '欧元区市场', href: '/markets/eurozone', activeKey: 'eurozone-market', isPlaceholder: true },
  { label: '日本市场', href: '/markets/japan', activeKey: 'japan-market', isPlaceholder: true },
  { label: 'Crypto 市场', href: '/markets/crypto', activeKey: 'crypto-market', isPlaceholder: true },
] as const;

export function getIndicatorNavigationGroups() {
  const groups = new Map<string, { label: string; themeSlug: string; href: string; items: Array<{ label: string; slug: string }> }>();

  for (const indicator of getSeedIndicators()) {
    const themeSlug = indicator.templateKey === 'generic' ? indicator.slug : indicator.templateKey;
    const group = groups.get(indicator.navGroup) ?? { label: indicator.navGroup, themeSlug, href: getThemeHref(themeSlug), items: [] };
    group.items.push({ label: indicator.title, slug: indicator.slug });
    groups.set(indicator.navGroup, group);
  }

  return Array.from(groups.values());
}
