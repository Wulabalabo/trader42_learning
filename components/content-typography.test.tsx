import { render, screen } from '@testing-library/react';

import { getIndicatorBySlug } from '@/lib/indicators';

import { IndicatorOverviewCard } from './indicator-overview-card';
import { IndicatorSection } from './indicator-section';
import { IndicatorSummary } from './indicator-summary';

describe('content typography', () => {
  it('uses larger title styles in content blocks', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator).toBeDefined();

    render(
      <div>
        <IndicatorSummary indicator={indicator!} />
        <IndicatorOverviewCard indicator={indicator!} source="美国劳工统计局" />
        <IndicatorSection title="市场怎么读" description="描述">
          <div />
        </IndicatorSection>
      </div>,
    );

    expect(screen.getByRole('heading', { name: '消费者价格指数（CPI）' }).className).toContain('text-[16px]');
    expect(screen.getByText('这个指标是什么').className).toContain('text-[13px]');
    expect(screen.getByText(/市场怎么读/).className).toContain('text-[13px]');
  });
});
