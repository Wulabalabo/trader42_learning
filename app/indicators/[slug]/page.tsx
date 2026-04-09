import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { InflationIndicatorTemplate } from '@/components/inflation-indicator-template';
import { ImpactGauge } from '@/components/impact-gauge';
import { IndicatorChart } from '@/components/indicator-chart';
import { IndicatorOverviewCard } from '@/components/indicator-overview-card';
import { GrowthIndicatorTemplate } from '@/components/growth-indicator-template';
import { LaborMarketIndicatorTemplate } from '@/components/labor-market-indicator-template';
import { MarketImpactGrid } from '@/components/market-impact-grid';
import { PolicyIndicatorTemplate } from '@/components/policy-indicator-template';
import { Card, CardBody } from '@/components/ui/card';
import { type Indicator, type IndicatorTemplateKey } from '@/lib/indicator-types';
import { getCachedIndicatorDataBySlug } from '@/lib/indicator-data';
import { getAllIndicators, getSeedIndicatorBySlug } from '@/lib/indicators';
import { TerminalDirectory } from '@/components/terminal-directory';
import { TerminalWorkspace } from '@/components/terminal-workspace';
import { formatObservationDate } from '@/lib/series';
import { getSeriesAverage, getSeriesComparison } from '@/lib/series';

export const revalidate = 86400;

type IndicatorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type IndicatorPageViewProps = {
  indicator: Indicator;
};

const templateRenderers: Partial<Record<IndicatorTemplateKey, (indicator: Indicator, source: string) => React.JSX.Element>> = {
  inflation: (indicator, source) => <InflationIndicatorTemplate indicator={indicator} source={source} />,
  labor: (indicator, source) => <LaborMarketIndicatorTemplate indicator={indicator} source={source} />,
  policy: (indicator, source) => <PolicyIndicatorTemplate indicator={indicator} source={source} />,
  growth: (indicator, source) => <GrowthIndicatorTemplate indicator={indicator} source={source} />,
};

function renderGenericTemplate(indicator: Indicator, source: string) {
  const comparison = getSeriesComparison(indicator.history);
  const average = getSeriesAverage(indicator.history, Math.min(12, indicator.history.length));

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
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{comparison?.latest.value ?? '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{indicator.historyUnit}</p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">较上期</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--accent-primary)]">
                {comparison?.change ? `${comparison.change.absolute > 0 ? '+' : ''}${comparison.change.absolute}` : '—'}
              </p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
                {comparison?.change?.percent !== undefined ? `约 ${comparison.change.percent > 0 ? '+' : ''}${comparison.change.percent}%` : '无上期对比'}
              </p>
            </div>

            <div className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">近 12 期均值</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{average ?? '—'}</p>
              <p className="mt-1 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{indicator.historyUnit}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <IndicatorOverviewCard indicator={indicator} source={source} />

      <IndicatorChart title={indicator.title} unit={indicator.historyUnit} history={indicator.history} note={indicator.historyNote} sourceLabel={indicator.historySource} />
    </>
  );
}

export async function generateMetadata({ params }: IndicatorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const indicator = getSeedIndicatorBySlug(slug);

  if (!indicator) {
    return { title: '未找到指标 | Trader42 指标字典' };
  }

  return {
    title: `${indicator.title} | Trader42 指标字典`,
    description: indicator.summary,
  };
}

export async function generateStaticParams() {
  return (await getAllIndicators()).map((indicator) => ({ slug: indicator.slug }));
}

export function IndicatorPageView({ indicator }: IndicatorPageViewProps) {
  const source = indicator.sourceLabel ?? '编辑学习备注';
  const latestPoint = indicator.history.at(-1);
  const latestObservationDate = latestPoint?.date ? formatObservationDate(latestPoint.date) : '—';
  const specializedTemplate = templateRenderers[indicator.templateKey];

  return (
    <TerminalWorkspace
      leftRail={<TerminalDirectory activeKey={indicator.slug} activeScopes={indicator.scopes} />}
      rightRail={
        <div className="space-y-3">
          <ImpactGauge label={indicator.title} level={indicator.currentAssessment.level} />
          <MarketImpactGrid impacts={indicator.marketImpact} />
        </div>
      }
    >
      <div className="space-y-3">
        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-3 border-b border-[color:var(--border-subtle)] pb-4">
              <div>
                <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{source}</p>
                <h1 className="mt-2 text-[2.1rem] font-semibold tracking-[0.04em] text-[color:var(--text-primary)] sm:text-[2.5rem]">
                  {indicator.title}
                </h1>
              </div>

              <div className="grid gap-2 text-sm leading-6 text-[color:var(--text-secondary)] sm:grid-cols-2 xl:grid-cols-4">
                <p className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-2">
                  <span className="text-[11px] font-medium tracking-[0.08em]">数据截至：</span>
                  <span className="ml-2 text-[color:var(--text-primary)]">{latestObservationDate}</span>
                </p>
                <p className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-2">
                  <span className="text-[11px] font-medium tracking-[0.08em]">页面整理：</span>
                  <span className="ml-2 text-[color:var(--text-primary)]">{indicator.updatedAt}</span>
                </p>
                <p className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-2">
                  <span className="text-[11px] font-medium tracking-[0.08em]">发布时间节奏：</span>
                  <span className="ml-2 text-[color:var(--text-primary)]">{indicator.releaseCadence}</span>
                </p>
                <p className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-2">
                  <span className="text-[11px] font-medium tracking-[0.08em]">数据来源：</span>
                  <span className="ml-2 text-[color:var(--text-primary)]">{indicator.historySource ?? source}</span>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {specializedTemplate ? specializedTemplate(indicator, source) : renderGenericTemplate(indicator, source)}
      </div>
    </TerminalWorkspace>
  );
}

export default async function IndicatorPage({ params }: IndicatorPageProps) {
  const { slug } = await params;
  const indicator = await getCachedIndicatorDataBySlug(slug);

  if (!indicator) {
    notFound();
  }

  return <IndicatorPageView indicator={indicator} />;
}
