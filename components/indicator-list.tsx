'use client';

import { useMemo, useState } from 'react';

import type { Indicator } from '@/lib/indicator-types';

import { IndicatorSummary } from './indicator-summary';
import { Badge } from './ui/badge';
import { Card, CardBody, CardHeader } from './ui/card';

type IndicatorListProps = {
  heading: string;
  description?: string;
  items: Indicator[];
};

export function IndicatorList({ heading, description, items }: IndicatorListProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'placeholder'>('all');

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [item.title, item.category, item.summary].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, query, statusFilter]);

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">&gt; {heading}</p>
          {description ? <p className="mt-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">{description}</p> : null}
        </CardHeader>
        <CardBody className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">搜索</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索指标、分类、摘要"
              className="w-full rounded-[2px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition-colors placeholder:text-[color:var(--text-secondary)] focus:border-[color:rgba(208,176,112,0.55)]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'live', label: '已完成' },
              { key: 'placeholder', label: '占位中' },
            ].map((option) => {
              const pressed = statusFilter === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setStatusFilter(option.key as 'all' | 'live' | 'placeholder')}
                  className="border-none bg-transparent p-0"
                >
                  <Badge variant={pressed ? 'gold' : 'soft'}>{option.label}</Badge>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[color:var(--border-subtle)]" />
        </CardBody>
      </Card>

      <div className="space-y-3">
        {filteredItems.map((indicator) => (
          <IndicatorSummary key={indicator.slug} indicator={indicator} />
        ))}
      </div>
    </section>
  );
}
