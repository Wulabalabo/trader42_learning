import type { MarketTheme } from '@/lib/indicator-types';

import { IndicatorSection } from './indicator-section';

type ThemeMarketImpactSectionProps = {
  theme: MarketTheme;
};

export function ThemeMarketImpactSection({ theme }: ThemeMarketImpactSectionProps) {
  return (
    <IndicatorSection title="这组数据通常怎么影响市场" description="先理解交易员为什么把这一组数据连起来看。">
      <div className="space-y-3 text-sm leading-6 text-[color:var(--text-secondary)]">
        {theme.marketImpactSummary.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </IndicatorSection>
  );
}
