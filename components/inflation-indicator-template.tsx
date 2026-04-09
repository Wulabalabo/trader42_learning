import { Card, CardBody } from './ui/card';
import { IndicatorChart } from './indicator-chart';
import { IndicatorOverviewCard } from './indicator-overview-card';

import type { Indicator } from '@/lib/indicator-types';
import { getSeriesAverage, getSeriesDelta } from '@/lib/series';

type InflationIndicatorTemplateProps = {
  indicator: Indicator;
  source: string;
};

export function InflationIndicatorTemplate({ indicator, source }: InflationIndicatorTemplateProps) {
  const monthlyChange = getSeriesDelta(indicator.history, 1);
  const trailingAverage = getSeriesAverage(indicator.history, 12);
  const latestPoint = indicator.history.at(-1);
  const formatPercent = (value: number | undefined) => (value === undefined ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(1)}%`);
  const dataSemanticsLabel = indicator.dataSemanticsLabel ?? '价格指数路径';
  const dataSemanticsNote =
    indicator.dataSemanticsNote ?? '当前直接展示价格指数点位；同比、环比等百分比变化需要基于这些点位再计算。';
  const isRateSeries = indicator.historyUnit === '%';
  const latestValueLabel = isRateSeries ? '同比（最新值）' : '点位（最近值）';
  const latestValueUnit = isRateSeries ? '%' : '指数点';
  const changeLabel = isRateSeries ? '较上期变化' : '较上期';
  const changeDetail = isRateSeries
    ? monthlyChange
      ? `较上期 ${monthlyChange.absolute > 0 ? '+' : ''}${monthlyChange.absolute.toFixed(2)} 个百分点`
      : '无可比上期'
    : monthlyChange
      ? `较上期 ${monthlyChange.absolute > 0 ? '+' : ''}${monthlyChange.absolute.toFixed(2)} 点`
      : '无可比上期';
  const averageDetail = isRateSeries ? '帮助看通胀中枢' : '帮助看价格水平';

  return (
    <>
      <Card>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">关键读数</p>
            <p className="border-l-2 border-[color:var(--accent-primary)] pl-3 text-[13px] leading-6 text-[color:var(--text-secondary)]">
              <span className="font-medium text-[color:var(--text-primary)]">当前展示口径：</span>
              <span className="ml-1">{dataSemanticsLabel}。</span>
              <span className="ml-2">{dataSemanticsNote}</span>
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{latestValueLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{latestPoint ? latestPoint.value.toFixed(2) : '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{latestValueUnit}</p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{changeLabel}</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--accent-primary)]">{formatPercent(monthlyChange?.percent)}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{changeDetail}</p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">近 12 期均值</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{trailingAverage ? trailingAverage.toFixed(2) : '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{averageDetail}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <IndicatorOverviewCard indicator={indicator} source={source} />

      <IndicatorChart title={indicator.title} unit={indicator.historyUnit} history={indicator.history} note={indicator.historyNote} sourceLabel={indicator.historySource ?? source} />
    </>
  );
}
