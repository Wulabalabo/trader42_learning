import { render, screen } from '@testing-library/react';

import { getIndicatorBySlug } from '@/lib/indicators';

import { InflationIndicatorTemplate } from './inflation-indicator-template';

describe('InflationIndicatorTemplate', () => {
  it('renders the inflation reading template with direct copy and history chart', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator).toBeDefined();

    render(<InflationIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/它其实就是美国政府在观察：普通人日常买东西，花的钱有没有变贵。/)).toBeInTheDocument();
    expect(screen.getByText(/这个数字就叫 CPI。/)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.getByText(/当前展示口径：/i)).toBeInTheDocument();
    expect(screen.getByText('点位（最近值）')).toBeInTheDocument();
    expect(screen.getAllByText('较上期').length).toBeGreaterThan(0);
    expect(screen.getByText(/近 12 期均值/i)).toBeInTheDocument();
    expect(screen.queryByText('环比')).toBeNull();
    expect(screen.queryByText('同比')).toBeNull();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.queryByText(/它还不能说明什么/i)).toBeNull();
    expect(screen.queryByText(/^最近值$/)).toBeNull();
    expect(screen.getByText('历史数据')).toBeInTheDocument();
  });

  it('renders semi-complete content for core CPI', async () => {
    const indicator = await getIndicatorBySlug('core-cpi');

    expect(indicator).toBeDefined();

    render(<InflationIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/把食品和能源这两类短期波动更大的项目先拿掉/)).toBeInTheDocument();
    expect(screen.getByText(/服务项和住房项这类更黏、更难快速回落/)).toBeInTheDocument();
    expect(screen.getByText('点位（最近值）')).toBeInTheDocument();
    expect(screen.getAllByText('较上期').length).toBeGreaterThan(0);
    expect(screen.getByText(/近 12 期均值/i)).toBeInTheDocument();
    expect(screen.queryByText('同比（最新值）')).toBeNull();
  });

  it('renders semi-complete content for core PCE', async () => {
    const indicator = await getIndicatorBySlug('core-pce');

    expect(indicator).toBeDefined();

    render(<InflationIndicatorTemplate indicator={indicator!} source="美国经济分析局" />);

    expect(screen.getByText(/更接近美联储真正盯着看的底层通胀/)).toBeInTheDocument();
    expect(screen.getAllByText(/服务消费和医疗等项目/).length).toBeGreaterThan(0);
    expect(screen.getByText(/近 12 期均值/i)).toBeInTheDocument();
  });

  it('renders semi-complete content for PPI', async () => {
    const indicator = await getIndicatorBySlug('ppi');

    expect(indicator).toBeDefined();

    render(<InflationIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/企业端的物价表/)).toBeInTheDocument();
    expect(screen.getByText(/企业成本能不能继续向下游传导/)).toBeInTheDocument();
    expect(screen.getByText(/近 12 期均值/i)).toBeInTheDocument();
  });
});
