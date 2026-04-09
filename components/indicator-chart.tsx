import type { IndicatorHistoryPoint } from '@/lib/indicator-types';
import { formatLaborComparison, formatLaborMeasurement, getLaborDisplayUnit } from '@/lib/labor-format';
import { buildSeriesPath, getSeriesComparison, getSeriesTickIndices } from '@/lib/series';

import { Card, CardBody, CardHeader } from './ui/card';

type IndicatorChartProps = {
  title: string;
  unit: string;
  indicatorSlug?: string;
  history: IndicatorHistoryPoint[];
  note: string;
  sourceLabel?: string;
  displayMode?: 'default' | 'labor';
};

export function IndicatorChart({ title, unit, indicatorSlug = 'unknown', history, note, sourceLabel = '样本数据', displayMode = 'default' }: IndicatorChartProps) {
  const displayHistory = history.slice(-24);
  const comparison = getSeriesComparison(displayHistory);
  const path = buildSeriesPath(displayHistory);
  const values = displayHistory.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const latestDisplay = displayMode === 'labor' ? formatLaborMeasurement(comparison?.latest.value, unit) : undefined;
  const comparisonDisplay = displayMode === 'labor' ? formatLaborComparison({ slug: indicatorSlug, historyUnit: unit }, comparison?.latest.value, comparison?.previous?.value) : undefined;
  const chartUnit = displayMode === 'labor' ? getLaborDisplayUnit(unit) : unit;
  const changeValue = comparison?.change
    ? displayMode === 'labor'
      ? comparisonDisplay?.valueText ?? '—'
      : `${comparison.change.absolute > 0 ? '+' : ''}${comparison.change.absolute}`
    : '—';
  const changeLabel = displayMode === 'labor' ? comparisonDisplay?.label ?? '较上期变化' : '较上期';
  const detailValue = displayMode === 'labor' ? comparisonDisplay?.detailText ?? '无可比上期' : comparison?.change?.percent !== undefined ? `约 ${comparison.change.percent > 0 ? '+' : ''}${comparison.change.percent}%` : '无上期对比';

  return (
    <Card>
      <CardHeader>
        <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">历史数据</p>
        <p className="mt-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">{title}</p>
        <p className="mt-1 text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">数据来源：{sourceLabel}</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">最新值</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{displayMode === 'labor' ? latestDisplay?.valueText ?? '—' : comparison?.latest.value ?? '—'}</p>
            <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{displayMode === 'labor' ? latestDisplay?.unitText ?? unit : unit}</p>
          </div>

          <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{changeLabel}</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--accent-primary)]">
              {changeValue}
            </p>
            <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
              {detailValue}
            </p>
          </div>

          <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">历史位置</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">
              {comparison ? `${comparison.position.label}` : '—'}
            </p>
            <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
              {comparison ? `约 ${comparison.position.percent}% 区间` : '无历史区间'}
            </p>
          </div>
        </div>

        <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
          <svg viewBox="0 0 640 220" className="h-56 w-full" role="img" aria-label={`${title} 历史图表`}>
            <line x1="24" y1="196" x2="616" y2="196" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="24" y1="24" x2="24" y2="196" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {path ? <path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="1.75" strokeLinejoin="round" /> : null}
            {displayHistory.length > 0 ? <text x="24" y="16" fill="rgba(255,255,255,0.5)" fontSize="10">数值</text> : null}
            {displayHistory.map((point, index) => {
              const tickIndices = getSeriesTickIndices(displayHistory.length);
              const showPoint = displayHistory.length <= 24 || tickIndices.includes(index);
              const showLabel = tickIndices.includes(index);
              const stepX = displayHistory.length === 1 ? 0 : (640 - 48) / (displayHistory.length - 1);
              const normalized = (point.value - min) / ((max - min) || 1);
              const x = 24 + index * stepX;
              const y = 196 - normalized * 172;

              if (!showPoint && !showLabel) {
                return null;
              }

              return (
                <g key={point.date}>
                  {showPoint ? <circle cx={x} cy={y} r="2.5" fill="var(--accent-primary)" /> : null}
                  {showLabel ? (
                    <text x={x} y="212" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">
                      {point.date}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
            <span>时间</span>
            <span>{chartUnit}</span>
          </div>
        </div>

        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
          单看最新值不够，市场更关心它和上期的差异，以及它在历史区间里的位置。
        </p>

        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{note}</p>
      </CardBody>
    </Card>
  );
}
