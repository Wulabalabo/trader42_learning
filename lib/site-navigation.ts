import { getSeedIndicators } from './indicators';
import { getThemeHref } from './theme-data';
import type { MarketSlug } from './indicator-types';

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
  { label: '美国市场', href: '/markets/us', activeKey: 'us-market', market: 'us', scopeLabel: '美国', isPlaceholder: false },
  { label: '中国市场', href: '/markets/china', activeKey: 'china-market', market: 'china', scopeLabel: '中国', isPlaceholder: false },
  { label: '欧元区市场', href: '/markets/eurozone', activeKey: 'eurozone-market', market: 'eurozone', scopeLabel: '欧元区', isPlaceholder: false },
  { label: '日本市场', href: '/markets/japan', activeKey: 'japan-market', market: undefined, scopeLabel: '日本', isPlaceholder: true },
  { label: 'Crypto 市场', href: '/markets/crypto', activeKey: 'crypto-market', market: undefined, scopeLabel: 'Crypto', isPlaceholder: true },
] as const;

export function getIndicatorNavigationGroups(market: MarketSlug) {
  const marketEntry = marketNavigation.find((entry) => entry.market === market);

  if (!marketEntry) {
    return [];
  }

  const groups = new Map<string, { label: string; themeSlug: string; href: string; items: Array<{ label: string; slug: string }> }>();

  for (const indicator of getSeedIndicators().filter((entry) => entry.scopes.includes(marketEntry.scopeLabel))) {
    const themeSlug = indicator.themeSlug ?? (indicator.templateKey === 'generic' ? indicator.slug : indicator.templateKey);
    const group = groups.get(indicator.navGroup) ?? { label: indicator.navGroup, themeSlug, href: getThemeHref(market, themeSlug), items: [] };
    group.items.push({ label: indicator.title, slug: indicator.slug });
    groups.set(indicator.navGroup, group);
  }

  return Array.from(groups.values());
}
