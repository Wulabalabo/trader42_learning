import { impactLevelLabel, type IndicatorMarketImpact } from '@/lib/indicator-types';

import { LevelLegend } from './level-legend';
import { Badge } from './ui/badge';
import { Card, CardBody, CardHeader } from './ui/card';

type MarketImpactGridProps = {
  impacts: IndicatorMarketImpact[];
};

const badgeVariant = {
  High: 'gold',
  Medium: 'soft',
  Low: 'neutral',
} as const;

export function MarketImpactGrid({ impacts }: MarketImpactGridProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[14px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">市场影响</p>
        <div className="mt-2">
          <LevelLegend />
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {impacts.map((impact) => (
            <div
              key={impact.market}
              className="border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[16px] font-medium tracking-[0.04em] text-[color:var(--text-primary)]">{impact.market}</p>
                <Badge variant={badgeVariant[impact.level]}>{impactLevelLabel[impact.level]}</Badge>
              </div>
              <p className="mt-2 text-[15px] leading-7 text-[color:var(--text-secondary)]">{impact.reason}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
