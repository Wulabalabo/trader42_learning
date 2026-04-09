import type { MarketTheme } from '@/lib/indicator-types';

import { IndicatorSection } from './indicator-section';

type ThemeReadingSectionProps = {
  theme: MarketTheme;
};

export function ThemeReadingSection({ theme }: ThemeReadingSectionProps) {
  return (
    <IndicatorSection title="怎么看这组数据" description="不要分散成多个重复标题，直接把阅读顺序和常见解读放在一个模块里。">
      <div className="space-y-5">
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
      </div>
    </IndicatorSection>
  );
}
