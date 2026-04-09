import { render, screen } from '@testing-library/react';

import { IndicatorChart } from './indicator-chart';

describe('IndicatorChart', () => {
  it('shows the latest value and history context', () => {
    render(
      <IndicatorChart
        title="消费者价格指数（CPI）"
        unit="同比 %"
        history={[
          { date: '2024-01', value: 3.1 },
          { date: '2024-03', value: 3.5 },
          { date: '2024-05', value: 3.3 },
        ]}
        note="仅用于学习的样本"
        sourceLabel="FRED"
      />,
    );

    expect(screen.getByText('消费者价格指数（CPI）')).toBeInTheDocument();
    expect(screen.getByText('3.3')).toBeInTheDocument();
    expect(screen.getByText('较上期')).toBeInTheDocument();
    expect(screen.getByText('历史位置')).toBeInTheDocument();
    expect(screen.getByText(/单看最新值/)).toBeInTheDocument();
    expect(screen.getByText('仅用于学习的样本')).toBeInTheDocument();
    expect(screen.getByText('数据来源：FRED')).toBeInTheDocument();
  });

  it('keeps only the latest 24 points for long series', () => {
    render(
      <IndicatorChart
        title="消费者价格指数（CPI）"
        unit="同比 %"
        history={Array.from({ length: 36 }, (_, index) => ({
          date: `2024-${String(index + 1).padStart(2, '0')}`,
          value: index + 1,
        }))}
        note="仅用于学习的样本"
        sourceLabel="FRED"
      />,
    );

    expect(screen.getByText('时间')).toBeInTheDocument();
    expect(screen.getAllByText('同比 %').length).toBeGreaterThan(0);
    expect(screen.getByText('36')).toBeInTheDocument();
    expect(screen.queryByText('2024-01')).toBeNull();
    expect(screen.getByText('2024-13')).toBeInTheDocument();
  });

  it('renders a unit-aware labor display', () => {
    render(
      <IndicatorChart
        title="初请失业金人数"
        unit="千人"
        displayMode="labor"
        history={[
          { date: '2024-01', value: 230 },
          { date: '2024-02', value: 243 },
        ]}
        note="仅用于学习的样本"
        sourceLabel="FRED"
      />,
    );

    expect(screen.getByText('较上期变化')).toBeInTheDocument();
    expect(screen.getByText('24.3')).toBeInTheDocument();
    expect(screen.getAllByText('万人').length).toBeGreaterThan(1);
    expect(screen.getByText('+1.3 万人')).toBeInTheDocument();
  });

  it('keeps the chart unit label aligned with the labor card display unit', () => {
    render(
      <IndicatorChart
        title="持续领取失业金人数"
        unit="千人"
        displayMode="labor"
        history={[
          { date: '2024-01', value: 1820 },
          { date: '2024-02', value: 1841 },
        ]}
        note="仅用于学习的样本"
        sourceLabel="FRED"
      />,
    );

    expect(screen.getAllByText('万人').length).toBeGreaterThan(1);
    expect(screen.queryByText('千人')).toBeNull();
  });
});
