import { render, screen } from '@testing-library/react';

import { getIndicatorBySlug } from '@/lib/indicators';

import { PolicyIndicatorTemplate } from './policy-indicator-template';

describe('PolicyIndicatorTemplate', () => {
  it('renders direct copy and history chart for FOMC', async () => {
    const indicator = await getIndicatorBySlug('fomc-rate-decision');

    expect(indicator).toBeDefined();

    render(<PolicyIndicatorTemplate indicator={indicator!} source="美联储" />);

    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.getByText(/目标区间/i)).toBeInTheDocument();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.getByText('历史数据')).toBeInTheDocument();
  });
});
