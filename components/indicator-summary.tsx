import Link from 'next/link';

import { impactLevelLabel, type Indicator } from '@/lib/indicator-types';

import { Badge } from './ui/badge';
import { Card, CardBody } from './ui/card';

type IndicatorSummaryProps = {
  indicator: Indicator;
};

const impactVariant = {
  High: 'gold',
  Medium: 'soft',
  Low: 'neutral',
} as const;

export function IndicatorSummary({ indicator }: IndicatorSummaryProps) {
  return (
    <Link href={`/indicators/${indicator.slug}`} className="block h-full">
      <Card className="h-full transition-colors hover:border-[color:rgba(208,176,112,0.35)] hover:bg-[color:rgba(255,255,255,0.02)]">
        <CardBody className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-3 border-b border-[color:var(--border-subtle)] pb-3">
            <div>
              <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{indicator.category}</p>
              <h3 className="mt-2 text-[16px] font-semibold tracking-[0.04em] text-[color:var(--text-primary)]">
                {indicator.title}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="neutral">{indicator.priority}</Badge>
              <Badge variant={indicator.status === 'live' ? 'gold' : 'soft'}>{indicator.status === 'live' ? '已完成' : '占位中'}</Badge>
              <Badge variant={impactVariant[indicator.currentAssessment.level]}>{impactLevelLabel[indicator.currentAssessment.level]}</Badge>
            </div>
          </div>

          <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{indicator.summary}</p>

          <div className="space-y-1 border-b border-[color:var(--border-subtle)] pb-3 text-[12px] leading-6 text-[color:var(--text-secondary)]">
            <p>发布时间节奏：{indicator.releaseCadence}</p>
            <p>最近更新：{indicator.updatedAt}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {indicator.marketImpact.slice(0, 3).map((market) => (
              <Badge key={market.market} variant={impactVariant[market.level]}>
                {market.market}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
