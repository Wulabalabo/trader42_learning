import type { MarketTheme } from '@/lib/indicator-types';

import { Card, CardBody } from './ui/card';

type ThemeOverviewCardProps = {
  theme: MarketTheme;
};

export function ThemeOverviewCard({ theme }: ThemeOverviewCardProps) {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] pb-3">
          <p className="text-[12px] font-medium tracking-[0.12em] text-[color:var(--text-secondary)]">美国市场 / 主题页</p>
          <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{theme.navLabel}</p>
        </div>

        <div className="space-y-3">
          <h1 className="text-[2.1rem] font-semibold tracking-[0.04em] text-[color:var(--text-primary)] sm:text-[2.5rem]">{theme.title}</h1>
          <p className="max-w-3xl text-[15px] leading-7 text-[color:var(--text-secondary)]">{theme.summary}</p>
        </div>

        <div className="space-y-3 text-[15px] leading-7 text-[color:var(--text-secondary)]">
          {theme.overview.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
