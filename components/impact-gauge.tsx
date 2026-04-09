import { impactLevelLabel, type ImpactLevel } from '@/lib/indicator-types';

import { Badge } from './ui/badge';
import { Card, CardBody, CardHeader } from './ui/card';

type ImpactGaugeProps = {
  label: string;
  level: ImpactLevel;
  subtitle?: string;
};

const levelScore: Record<ImpactLevel, number> = {
  High: 84,
  Medium: 58,
  Low: 32,
};

export function ImpactGauge({ label, level, subtitle = '波动评级' }: ImpactGaugeProps) {
  const score = levelScore[level];

  return (
    <Card>
      <CardHeader>
        <p className="text-[14px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">市场影响</p>
        <p className="mt-2 text-[16px] leading-7 text-[color:var(--text-secondary)]">{label}</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-center">
          <div
            className="relative grid h-40 w-40 place-items-center rounded-full border border-[color:var(--border-subtle)]"
            style={{
              background: `conic-gradient(var(--accent-primary) 0 ${score}%, rgba(255,255,255,0.08) ${score}% 100%)`,
            }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)]">
              <div className="text-center">
                <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{subtitle}</p>
                <p className="mt-2 text-[1.3rem] font-semibold tracking-[0.04em] text-[color:var(--accent-primary)]">
                  {impactLevelLabel[level]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[color:var(--border-subtle)] pt-3 text-[11px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">
          <span>低</span>
          <Badge variant={level === 'High' ? 'gold' : level === 'Medium' ? 'soft' : 'neutral'}>{impactLevelLabel[level]}</Badge>
          <span>高</span>
        </div>
      </CardBody>
    </Card>
  );
}
