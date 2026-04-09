import { fireEvent, render, screen } from '@testing-library/react';

import { getAllIndicators } from '@/lib/indicators';

import { IndicatorList } from './indicator-list';

describe('IndicatorList', () => {
  it('filters between all, live, and placeholder indicators', async () => {
    const indicators = await getAllIndicators();

    render(<IndicatorList heading="核心指标" items={indicators} />);

    expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /消费者价格指数（CPI）/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /持续领取失业金人数/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '已完成' }));

    expect(screen.getByRole('button', { name: '已完成' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /消费者价格指数（CPI）/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /持续领取失业金人数/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '占位中' }));

    expect(screen.getByRole('button', { name: '占位中' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('link', { name: /持续领取失业金人数/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /消费者价格指数（CPI）/ })).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('shows research priority and release cadence on cards', async () => {
    const indicators = await getAllIndicators();

    render(<IndicatorList heading="核心指标" items={indicators} />);

    expect(screen.getAllByText('P1').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/发布时间节奏：每月中旬/).length).toBeGreaterThan(0);
  });
});
