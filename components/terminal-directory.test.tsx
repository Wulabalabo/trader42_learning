import { fireEvent, render, screen } from '@testing-library/react';

import { TerminalDirectory } from './terminal-directory';

describe('TerminalDirectory', () => {
  it('shows Chinese indicator labels', () => {
    render(<TerminalDirectory activeKey="cpi" />);

    expect(screen.getByText('站点导航')).toBeInTheDocument();
    expect(screen.queryByText('范围')).toBeNull();
    expect(screen.queryByText('Global')).toBeNull();
    expect(screen.getByRole('link', { name: '首页' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '美国市场' })).toHaveAttribute('href', '/markets/us');
    expect(screen.getByRole('link', { name: /中国市场/ })).toHaveAttribute('href', '/markets/china');
    expect(screen.getByRole('link', { name: /欧元区市场/ })).toHaveAttribute('href', '/markets/eurozone');
    expect(screen.getByRole('link', { name: /日本市场/ })).toHaveAttribute('href', '/markets/japan');
    expect(screen.getByRole('link', { name: /Crypto 市场/ })).toHaveAttribute('href', '/markets/crypto');
    expect(screen.getAllByText('施工中').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: '收起美国市场分组' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '通胀指标' })).toHaveAttribute('href', '/markets/us/inflation');
    expect(screen.getByRole('link', { name: '就业市场' })).toHaveAttribute('href', '/markets/us/labor');
    expect(screen.getByRole('link', { name: '央行政策' })).toHaveAttribute('href', '/markets/us/policy');
    expect(screen.getByRole('link', { name: '增长与景气' })).toHaveAttribute('href', '/markets/us/growth');

    expect(screen.getByRole('link', { name: '消费者价格指数（CPI）' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '个人消费支出物价指数（PCE）' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '核心 CPI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '生产者价格指数（PPI）' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '核心 PCE' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '非农就业人数（NFP）' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '失业率' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '初请失业金人数' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '持续领取失业金人数' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '职位空缺（JOLTS）' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FOMC 利率决议' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ISM 制造业 PMI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '零售销售' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'S&P Global 美国服务业 PMI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '密歇根消费者信心' })).toBeInTheDocument();
  });

  it('highlights the active theme heading', () => {
    render(<TerminalDirectory activeTheme="inflation" />);

    expect(screen.getByRole('link', { name: '通胀指标' })).toHaveClass('bg-[color:rgba(208,176,112,0.08)]');
  });

  it('shows clearer hierarchy between market, theme, and indicators', () => {
    render(<TerminalDirectory activeTheme="inflation" activeKey="cpi" />);

    expect(screen.getByRole('link', { name: '通胀指标' })).toHaveClass('ml-4');
    expect(screen.getByRole('link', { name: '消费者价格指数（CPI）' })).toHaveClass('ml-8');
  });

  it('collapses the us market group by default on non-us pages and expands on click', () => {
    render(<TerminalDirectory activeKey="china-market" activeScopes={['中国']} />);

    expect(screen.getByRole('button', { name: '展开美国市场分组' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: '通胀指标' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '展开美国市场分组' }));

    expect(screen.getByRole('button', { name: '收起美国市场分组' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '通胀指标' })).toBeInTheDocument();
  });

  it('uses a larger font size for theme links', () => {
    render(<TerminalDirectory activeTheme="inflation" />);

    expect(screen.getByRole('link', { name: '通胀指标' })).toHaveClass('text-[12px]');
  });

  it('highlights the us market entry', () => {
    render(<TerminalDirectory activeKey="us-market" />);

    expect(screen.getByRole('link', { name: '美国市场' })).toHaveClass('bg-[color:rgba(208,176,112,0.08)]');
  });

  it('highlights placeholder market entries too', () => {
    render(<TerminalDirectory activeKey="china-market" activeScopes={['中国']} />);

    expect(screen.getByRole('link', { name: /中国市场/ })).toHaveClass('bg-[color:rgba(208,176,112,0.08)]');
  });

  it('lists eurozone before japan and crypto in the market menu', () => {
    render(<TerminalDirectory activeKey="home" />);

    const marketLinks = screen.getAllByRole('link').map((link) => link.textContent);
    const eurozoneIndex = marketLinks.findIndex((text) => text?.includes('欧元区市场'));
    const japanIndex = marketLinks.findIndex((text) => text?.includes('日本市场'));
    const cryptoIndex = marketLinks.findIndex((text) => text?.includes('Crypto 市场'));

    expect(eurozoneIndex).toBeLessThan(japanIndex);
    expect(japanIndex).toBeLessThan(cryptoIndex);
  });

  it('shows eurozone theme links when the eurozone market is active', () => {
    render(<TerminalDirectory activeTheme="inflation" activeKey="eurozone-market" activeScopes={['欧元区']} />);

    expect(screen.getByRole('link', { name: '欧元区市场' })).not.toHaveTextContent('施工中');
    expect(screen.getByRole('link', { name: '通胀与价格' })).toHaveAttribute('href', '/markets/eurozone/inflation');
    expect(screen.getByRole('link', { name: '欧洲央行政策' })).toHaveAttribute('href', '/markets/eurozone/policy');
  });

  it('expands the china market group when china is active', () => {
    render(<TerminalDirectory activeKey="china-market" activeScopes={['中国']} />);

    expect(screen.getByRole('button', { name: '收起中国市场分组' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '中国市场' })).not.toHaveTextContent('施工中');
    expect(screen.getByRole('link', { name: '增长与内需' })).toHaveAttribute('href', '/markets/china/demand');
    expect(screen.getByRole('link', { name: '地产与信用脉冲' })).toHaveAttribute('href', '/markets/china/credit');
    expect(screen.getByRole('link', { name: '政策托底与汇率' })).toHaveAttribute('href', '/markets/china/policy');
    expect(screen.getByRole('link', { name: '商品需求与区域传导' })).toHaveAttribute('href', '/markets/china/commodities');
  });

  it('collapses the china market group by default on non-china pages', () => {
    render(<TerminalDirectory activeKey="us-market" />);

    expect(screen.getByRole('button', { name: '展开中国市场分组' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: '增长与内需' })).toBeNull();
  });
});
