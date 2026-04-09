import type { MarketTheme } from '@/lib/indicator-types';

import { IndicatorSection } from './indicator-section';

type ThemeInterpretationSectionProps = {
  theme: MarketTheme;
};

export function ThemeInterpretationSection({ theme }: ThemeInterpretationSectionProps) {
  return (
    <IndicatorSection title="怎么看这组数据" description="">
      <div className="space-y-6">
        {theme.howToRead.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-primary)]">{section.title}</p>
            <ul className="space-y-3 text-sm leading-6 text-[color:var(--text-secondary)]">
              {section.items?.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-3 border-t border-[color:var(--border-subtle)] pt-4">
          <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-primary)]">市场会怎么交易</p>
          <div className="space-y-3 text-sm leading-6 text-[color:var(--text-secondary)]">
            {theme.marketImpactSummary.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </IndicatorSection>
  );
}
