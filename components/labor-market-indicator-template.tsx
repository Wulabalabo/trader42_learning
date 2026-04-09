import { Card, CardBody } from './ui/card';
import { IndicatorChart } from './indicator-chart';
import { IndicatorOverviewCard } from './indicator-overview-card';

import type { Indicator } from '@/lib/indicator-types';
import { formatLaborComparison, formatLaborMeasurement } from '@/lib/labor-format';
import { getSeriesComparison } from '@/lib/series';

type LaborMarketIndicatorTemplateProps = {
  indicator: Indicator;
  source: string;
};

export function LaborMarketIndicatorTemplate({ indicator, source }: LaborMarketIndicatorTemplateProps) {
  const historyComparison = getSeriesComparison(indicator.history);
  const latestPoint = indicator.history.at(-1);
  const latestValue = formatLaborMeasurement(latestPoint?.value, indicator.historyUnit, indicator.valueDecimals);
  const comparisonDisplay = formatLaborComparison(indicator, historyComparison?.latest.value, historyComparison?.previous?.value);

  return (
    <>
      <Card>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">关键读数</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">最新值</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{latestValue.valueText}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{latestValue.unitText}</p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{comparisonDisplay.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--accent-primary)]">
                {comparisonDisplay.valueText}
              </p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
                {comparisonDisplay.detailText}
              </p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">历史位置</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{historyComparison ? historyComparison.position.label : '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
                {historyComparison ? `约 ${historyComparison.position.percent}% 区间` : '无历史区间'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <IndicatorOverviewCard indicator={indicator} source={source} />

      <IndicatorChart
        title={indicator.title}
        unit={indicator.historyUnit}
        indicatorSlug={indicator.slug}
        history={indicator.history}
        note={indicator.historyNote}
        sourceLabel={indicator.historySource ?? source}
        displayMode="labor"
      />
    </>
  );
}
