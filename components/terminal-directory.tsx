'use client';

import Link from 'next/link';
import { useState } from 'react';

import { getIndicatorNavigationGroups, marketNavigation } from '@/lib/site-navigation';
import type { MarketSlug } from '@/lib/indicator-types';

import { Card, CardBody, CardHeader } from './ui/card';

type TerminalDirectoryProps = {
  activeKey?: string;
  activeScopes?: string[];
  activeTheme?: string;
};

const homeItem = { label: '首页', href: '/' } as const;

const scopeToMarket: Record<string, MarketSlug | undefined> = {
  美国: 'us',
  欧元区: 'eurozone',
  中国: 'china',
};

export function TerminalDirectory({ activeKey, activeScopes, activeTheme }: TerminalDirectoryProps) {
  const activeMarket =
    activeScopes?.map((scope) => scopeToMarket[scope]).find(Boolean) ??
    (activeKey === 'us-market' ? 'us' : activeKey === 'eurozone-market' ? 'eurozone' : activeKey === 'china-market' ? 'china' : activeTheme ? 'us' : undefined);
  const usGroups = getIndicatorNavigationGroups('us');
  const eurozoneGroups = getIndicatorNavigationGroups('eurozone');
  const chinaGroups = getIndicatorNavigationGroups('china');
  const hasActiveUsIndicator = usGroups.some((group) => group.items.some((item) => item.slug === activeKey));
  const hasActiveEurozoneIndicator = eurozoneGroups.some((group) => group.items.some((item) => item.slug === activeKey));
  const hasActiveChinaIndicator = chinaGroups.some((group) => group.items.some((item) => item.slug === activeKey));
  const [isUsMarketExpanded, setIsUsMarketExpanded] = useState(activeKey === 'us-market' || activeMarket === 'us' || hasActiveUsIndicator);
  const [isEurozoneMarketExpanded, setIsEurozoneMarketExpanded] = useState(activeKey === 'eurozone-market' || activeMarket === 'eurozone' || hasActiveEurozoneIndicator);
  const [isChinaMarketExpanded, setIsChinaMarketExpanded] = useState(activeKey === 'china-market' || activeMarket === 'china' || hasActiveChinaIndicator);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center">
        <p className="text-[12px] font-medium tracking-[0.12em] text-[color:var(--text-primary)]">站点导航</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <Link
          href={homeItem.href}
          className={[
            'flex items-center gap-3 border-l-2 px-3 py-2 text-[13px] font-medium tracking-[0.04em] transition-colors',
            activeKey === 'home'
              ? 'border-[color:var(--accent-primary)] bg-[color:rgba(208,176,112,0.08)] text-[color:var(--text-primary)]'
              : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
          ].join(' ')}
        >
          <span className="h-2 w-2 border border-current" />
          <span>{homeItem.label}</span>
        </Link>

        {marketNavigation.map((market) => {
          if (market.market === 'us' || market.market === 'eurozone' || market.market === 'china') {
            const allGroups = { us: usGroups, eurozone: eurozoneGroups, china: chinaGroups };
            const allExpanded = { us: isUsMarketExpanded, eurozone: isEurozoneMarketExpanded, china: isChinaMarketExpanded };
            const allSetExpanded = { us: setIsUsMarketExpanded, eurozone: setIsEurozoneMarketExpanded, china: setIsChinaMarketExpanded };
            const groups = allGroups[market.market];
            const isExpanded = allExpanded[market.market];
            const setExpanded = allSetExpanded[market.market];

            return (
              <div key={market.href} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={market.href}
                    className={[
                      'flex min-w-0 flex-1 items-center gap-3 border-l-2 px-3 py-2 text-[13px] font-medium tracking-[0.04em] transition-colors',
                      activeKey === market.activeKey
                        ? 'border-[color:var(--accent-primary)] bg-[color:rgba(208,176,112,0.08)] text-[color:var(--text-primary)]'
                        : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
                    ].join(' ')}
                  >
                    <span className="h-2 w-2 border border-current" />
                    <span>{market.label}</span>
                  </Link>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? `收起${market.label}分组` : `展开${market.label}分组`}
                    onClick={() => setExpanded((value) => !value)}
                    className="border border-[color:var(--border-subtle)] px-2 py-2 text-[11px] leading-none text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </div>

                {isExpanded
                  ? groups.map((group) => (
                      <div key={group.label} className="ml-4 border-l border-[color:rgba(255,255,255,0.05)] pl-3">
                        <Link
                          href={group.href}
                          className={[
                            'mb-2 ml-4 block border-l-2 px-3 py-2 text-[12px] font-medium tracking-[0.08em] transition-colors',
                            activeTheme === group.themeSlug && activeMarket === market.market
                              ? 'border-[color:var(--accent-primary)] bg-[color:rgba(208,176,112,0.08)] text-[color:var(--text-primary)]'
                              : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
                          ].join(' ')}
                        >
                          {group.label}
                        </Link>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const active = activeKey === item.slug;

                            return (
                              <Link
                                key={item.slug}
                                href={`/indicators/${item.slug}`}
                                className={[
                                  'ml-8 flex items-center gap-3 border-l-2 px-3 py-2 text-[13px] font-medium tracking-[0.04em] transition-colors',
                                  active
                                    ? 'border-[color:var(--accent-primary)] bg-[color:rgba(208,176,112,0.08)] text-[color:var(--text-primary)]'
                                    : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
                                ].join(' ')}
                              >
                                <span className="h-2 w-2 border border-current" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            );
          }

          return (
            <Link
              key={market.href}
              href={market.href}
              className={[
                'flex items-center gap-3 border-l-2 px-3 py-2 text-[13px] font-medium tracking-[0.04em] transition-colors',
                activeKey === market.activeKey
                  ? 'border-[color:var(--accent-primary)] bg-[color:rgba(208,176,112,0.08)] text-[color:var(--text-primary)]'
                  : 'border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]',
              ].join(' ')}
            >
              <span className="h-2 w-2 border border-current" />
              <span>{market.label}</span>
              {market.isPlaceholder ? (
                <span className="ml-auto border border-[color:var(--border-subtle)] px-2 py-[2px] text-[10px] tracking-[0.12em] text-[color:var(--text-secondary)]">
                  施工中
                </span>
              ) : null}
            </Link>
          );
        })}
      </CardBody>
    </Card>
  );
}
