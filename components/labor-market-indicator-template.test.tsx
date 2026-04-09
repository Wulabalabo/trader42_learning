import { render, screen } from '@testing-library/react';

import { getIndicatorBySlug } from '@/lib/indicators';

import { LaborMarketIndicatorTemplate } from './labor-market-indicator-template';

describe('LaborMarketIndicatorTemplate', () => {
  it('renders the payroll reading template with direct copy and history chart', async () => {
    const indicator = await getIndicatorBySlug('nonfarm-payrolls');

    expect(indicator).toBeDefined();

    render(<LaborMarketIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.getAllByText('最新值').length).toBeGreaterThan(0);
    expect(screen.getAllByText('上期读数').length).toBeGreaterThan(0);
    expect(screen.getAllByText('18.7').length).toBeGreaterThan(0);
    expect(screen.getAllByText('万个岗位').length).toBeGreaterThan(0);
    expect(screen.getAllByText('25.6 万个岗位').length).toBeGreaterThan(0);
    expect(screen.getAllByText('历史位置').length).toBeGreaterThan(0);
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.queryByText(/它还不能说明什么/i)).toBeNull();
    expect(screen.getByText('历史数据')).toBeInTheDocument();
  });

  it('renders semi-complete content for unemployment rate', async () => {
    const indicator = await getIndicatorBySlug('unemployment-rate');

    expect(indicator).toBeDefined();

    render(<LaborMarketIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/愿意找工作的人里，现在有多少比例还没找到工作/)).toBeInTheDocument();
    expect(screen.getByText(/如果失业率抬升同时伴随新增就业走弱/)).toBeInTheDocument();
    expect(screen.getAllByText('%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('最新值').length).toBeGreaterThan(0);
  });

  it('renders semi-complete content for JOLTS job openings', async () => {
    const indicator = await getIndicatorBySlug('jolts-job-openings');

    expect(indicator).toBeDefined();

    render(<LaborMarketIndicatorTemplate indicator={indicator!} source="美国劳工统计局" />);

    expect(screen.getByText(/岗位空缺越多/)).toBeInTheDocument();
    expect(screen.getByText(/职位空缺如果连续回落/)).toBeInTheDocument();
    expect(screen.getAllByText('万个岗位').length).toBeGreaterThan(0);
  });

  it('renders semi-complete content for initial jobless claims', async () => {
    const indicator = await getIndicatorBySlug('initial-jobless-claims');

    expect(indicator).toBeDefined();

    render(<LaborMarketIndicatorTemplate indicator={indicator!} source="美国劳工部" />);

    expect(screen.getByText(/这一周新出现了多少人开始申请失业救济/)).toBeInTheDocument();
    expect(screen.getAllByText(/如果初请持续抬升/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('万人').length).toBeGreaterThan(0);
  });

  it('renders semi-complete content for continuing jobless claims', async () => {
    const indicator = await getIndicatorBySlug('continuing-jobless-claims');

    expect(indicator).toBeDefined();

    render(<LaborMarketIndicatorTemplate indicator={indicator!} source="美国劳工部" />);

    expect(screen.getByText(/已经失业的人，找新工作的速度是不是在变慢/)).toBeInTheDocument();
    expect(screen.getAllByText(/如果续请人数上升/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('万人').length).toBeGreaterThan(0);
  });
});
