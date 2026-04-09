import { Card, CardBody } from './ui/card';

import type { Indicator } from '@/lib/indicator-types';

type IndicatorOverviewCardProps = {
  indicator: Indicator;
  source: string;
};

export function IndicatorOverviewCard({ indicator, source }: IndicatorOverviewCardProps) {
  const readingGuide = indicator.readingGuide;
  const summaryLines = readingGuide?.summary ?? [indicator.summary];
  const content = readingGuide?.sections ? (
    readingGuide.sections.map((section) => (
      <div key={section.title} className="space-y-2">
        <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">{section.title}</p>
        <div className="space-y-3 text-sm leading-7 text-[color:var(--text-secondary)]">
          {section.blocks.map((block, index) =>
            block.type === 'paragraph' ? (
              <p key={`${section.title}-p-${index}`}>{block.text}</p>
            ) : (
              <ul key={`${section.title}-b-${index}`} className="space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ),
          )}
        </div>
      </div>
    ))
  ) : (
    <div className="space-y-2">
      <p className="text-[12px] font-medium tracking-[0.08em] text-[color:var(--text-secondary)]">它在做什么</p>
      <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
        来源：{source}。{indicator.historyNote}
      </p>
      <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{indicator.whatItMeans.join(' ')}</p>
    </div>
  );

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          <p className="text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">这个指标是什么</p>

          <div className="space-y-2">
            {summaryLines.map((line) => (
              <p key={line} className="text-sm leading-7 text-[color:var(--text-secondary)]">
                {line}
              </p>
            ))}
          </div>

          <div className="space-y-4 border-t border-[color:var(--border-subtle)] pt-4">{content}</div>
        </div>
      </CardBody>
    </Card>
  );
}
