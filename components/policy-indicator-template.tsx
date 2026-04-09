import { Card, CardBody } from './ui/card';
import { IndicatorChart } from './indicator-chart';
import { IndicatorOverviewCard } from './indicator-overview-card';

import type { Indicator } from '@/lib/indicator-types';
import { getSeriesComparison } from '@/lib/series';

type PolicyIndicatorTemplateProps = {
  indicator: Indicator;
  source: string;
};

export function PolicyIndicatorTemplate({ indicator, source }: PolicyIndicatorTemplateProps) {
  const historyComparison = getSeriesComparison(indicator.history);
  const latestPoint = indicator.history.at(-1);

  return (
    <>
      <Card>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">关键读数</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">目标区间</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{latestPoint ? `${latestPoint.value.toFixed(2)}%` : '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">最新政策锚点</p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">政策立场</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--accent-primary)]">{indicator.currentAssessment.level}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">对应市场定价强度</p>
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

      <IndicatorChart title={indicator.title} unit={indicator.historyUnit} history={indicator.history} note={indicator.historyNote} sourceLabel={indicator.historySource ?? source} />
    </>
  );
}
