import { render, screen } from '@testing-library/react';

import { getIndicatorBySlug } from '@/lib/indicators';

import { GrowthIndicatorTemplate } from './growth-indicator-template';

describe('GrowthIndicatorTemplate', () => {
  it('renders direct copy and history chart for ISM PMI', async () => {
    const indicator = await getIndicatorBySlug('ism-pmi');

    expect(indicator).toBeDefined();

    render(<GrowthIndicatorTemplate indicator={indicator!} source="Trading Economics" />);

    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/较前值/)).toBeInTheDocument();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.getByText('历史数据')).toBeInTheDocument();
  });

  it('renders semi-complete content for S&P services PMI substitute', async () => {
    const indicator = await getIndicatorBySlug('ism-services-pmi');

    expect(indicator).toBeDefined();

    render(<GrowthIndicatorTemplate indicator={indicator!} source="S&P Global（替代口径）" />);

    expect(screen.getAllByText(/S&P Global 美国服务业 PMI/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/它和 ISM 服务业 PMI 高度相关/).length).toBeGreaterThan(0);
    expect(screen.getByText(/较前值/)).toBeInTheDocument();
  });
});
