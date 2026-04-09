import type { Indicator } from '@/lib/indicator-types';

import { IndicatorSection } from './indicator-section';

type IndicatorContentSectionsProps = {
  indicator: Indicator;
};

export function IndicatorContentSections({ indicator }: IndicatorContentSectionsProps) {
  return (
    <>
      <IndicatorSection title="为什么重要" description="先理解它为什么会被市场定价。">
        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{indicator.whyItMatters}</p>
      </IndicatorSection>

      <IndicatorSection title="市场先看什么" description="先把这组数据拆成最先会被交易的关键信息。">
        <ul className="space-y-3 text-sm leading-6 text-[color:var(--text-secondary)]">
          {indicator.whatItMeans.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent-primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </IndicatorSection>

      <IndicatorSection title="当前判断" description="这是当前页面对这个指标的学习定位。">
        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{indicator.currentAssessment.reason}</p>
      </IndicatorSection>

      <IndicatorSection title="历史说明" description="说明当前页面这组时间序列的学习口径。">
        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{indicator.historyNote}</p>
      </IndicatorSection>
    </>
  );
}
