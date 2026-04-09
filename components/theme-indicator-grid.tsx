import Link from 'next/link';

import type { Indicator } from '@/lib/indicator-types';
import { formatLaborComparison, formatLaborMeasurement } from '@/lib/labor-format';

import { Card, CardBody } from './ui/card';

type ThemeIndicatorGridProps = {
  indicators: Indicator[];
};

function formatValue(indicator: Indicator) {
  const value = indicator.latestSnapshot?.value ?? indicator.history.at(-1)?.value;

  if (value === undefined) {
    return '—';
  }

  if (indicator.templateKey === 'policy') {
    return `${value.toFixed(2)}%`;
  }

  if (indicator.templateKey === 'growth') {
    return value.toFixed(1);
  }

  if (indicator.templateKey === 'labor') {
    const { valueText, unitText } = formatLaborMeasurement(value, indicator.historyUnit, indicator.valueDecimals);

    return `${valueText} ${unitText}`;
  }

  const decimals = indicator.valueDecimals ?? (Math.abs(value) >= 100 ? 0 : 1);
  return `${value.toFixed(decimals)} ${indicator.historyUnit}`;
}

function formatComparison(indicator: Indicator) {
  const currentValue = indicator.latestSnapshot?.value ?? indicator.history.at(-1)?.value;
  const previousValue = indicator.latestSnapshot?.previousValue ?? indicator.history.at(-2)?.value;

  if (indicator.templateKey === 'labor') {
    return formatLaborComparison(indicator, currentValue, previousValue);
  }

  if (currentValue === undefined || previousValue === undefined || previousValue === 0) {
    return { label: '较上期变化', valueText: undefined };
  }

  const delta = ((currentValue - previousValue) / previousValue) * 100;
  const sign = delta > 0 ? '+' : delta < 0 ? '-' : '';

  return { label: '较上期变化', valueText: `${sign}${Math.abs(delta).toFixed(1)}%` };
}

export function ThemeIndicatorGrid({ indicators }: ThemeIndicatorGridProps) {
  return (
    <section className="space-y-3">
      <div data-testid="theme-indicator-list" className="grid grid-cols-1 gap-3">
        {indicators.map((indicator) => {
          const comparison = formatComparison(indicator);

          return (
            <Link key={indicator.slug} href={`/indicators/${indicator.slug}`} className="block h-full">
              <Card className="h-full transition-colors hover:border-[color:rgba(208,176,112,0.35)] hover:bg-[color:rgba(255,255,255,0.02)]">
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border-subtle)] pb-3">
                    <div>
                      <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{indicator.category}</p>
                      <h2 className="mt-2 text-[16px] font-semibold tracking-[0.04em] text-[color:var(--text-primary)]">{indicator.title}</h2>
                    </div>
                    <p className="text-right text-[18px] font-semibold text-[color:var(--accent-primary)]">{formatValue(indicator)}</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
                      <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">当前值</p>
                      <p className="mt-2 text-[18px] font-semibold text-[color:var(--text-primary)]">{formatValue(indicator)}</p>
                    </div>

                    <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
                      <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{comparison.label}</p>
                      <p className="mt-2 text-[18px] font-semibold text-[color:var(--text-primary)]">{comparison.valueText ?? '—'}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
