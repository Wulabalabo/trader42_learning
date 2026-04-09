import { render, screen } from '@testing-library/react';

import MarketThemePage from './page';

describe('US market theme page', () => {
  it('renders the inflation topic page', async () => {
    render(await MarketThemePage({ params: Promise.resolve({ theme: 'inflation' }) }));

    expect(screen.getByRole('heading', { name: '美国通胀' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-main-grid')).toHaveClass('xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]');
    expect(screen.queryByText('核心指标读数')).toBeNull();
    expect(screen.queryByText('先扫一遍这一组指标现在分别在说什么，再决定去深读哪一个指标页。')).toBeNull();
    expect(screen.queryByText('这些指标之间的关系')).toBeNull();
    expect(screen.queryByText('先建立结构，再去看单个读数，才不容易被某一次数据发布带偏。')).toBeNull();
    expect(screen.getByTestId('theme-indicator-list')).toHaveClass('grid-cols-1');
    expect(screen.getAllByTestId('theme-relationship-card').length).toBeGreaterThan(0);
    expect(screen.getByText(/先分清消费者端和企业端/)).toBeInTheDocument();
    expect(screen.getByText(/怎么看这组数据/)).toBeInTheDocument();
    expect(screen.queryByText(/这组数据通常怎么影响市场/)).toBeNull();
    expect(screen.getByText(/市场会怎么交易/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /消费者价格指数（CPI）/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /个人消费支出物价指数（PCE）/ }).length).toBeGreaterThan(0);
  });

  it('renders the labor topic page', async () => {
    render(await MarketThemePage({ params: Promise.resolve({ theme: 'labor' }) }));

    expect(screen.getByRole('heading', { name: '美国就业' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /非农就业人数（NFP）/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /职位空缺（JOLTS）/ }).length).toBeGreaterThan(0);
  });
});
