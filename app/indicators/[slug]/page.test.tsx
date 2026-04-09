import { render, screen, within } from '@testing-library/react';
import { getIndicatorDataBySlug } from '@/lib/indicator-data';
import { getIndicatorBySlug } from '@/lib/indicators';

import { IndicatorPageView, generateMetadata } from './page';

describe('Indicator detail page', () => {
  it('renders the selected indicator sections', async () => {
    const indicator = await getIndicatorBySlug('cpi');

    expect(indicator).toBeDefined();
    const { container } = render(<IndicatorPageView indicator={indicator!} />);
    const workspace = container.firstElementChild as HTMLElement;
    const centerColumn = workspace.children[1] as HTMLElement;
    const rightRail = workspace.children[2] as HTMLElement;

    expect(screen.getByRole('heading', { name: '消费者价格指数（CPI）' })).toBeInTheDocument();
    expect(screen.getByText(/数据截至：/i)).toBeInTheDocument();
    expect(screen.getByText(/页面整理：/i)).toBeInTheDocument();
    expect(screen.getByText(/发布时间节奏：/i)).toBeInTheDocument();
    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/它其实就是美国政府在观察/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i).compareDocumentPosition(screen.getByText(/这个指标是什么/i)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.queryByText(/编号：/i)).toBeNull();
    expect(screen.queryByText(/最后更新：样本学习序列/i)).toBeNull();
    expect(screen.queryByText(/交易员先问它有没有超预期/i)).toBeNull();
    expect(screen.getByText('点位（最近值）')).toBeInTheDocument();
    expect(screen.getAllByText('较上期').length).toBeGreaterThan(0);
    expect(screen.queryByText('环比')).toBeNull();
    expect(screen.queryByText('同比')).toBeNull();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.getAllByText(/市场影响/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/为什么重要/i)).toBeNull();
    expect(screen.queryByText(/市场先看什么/i)).toBeNull();
    expect(screen.queryByText(/当前判断/i)).toBeNull();
    expect(screen.queryByText(/历史说明/i)).toBeNull();
    expect(screen.queryByText(/它还不能说明什么/i)).toBeNull();
    expect(screen.queryByText(/研究优先级/i)).toBeNull();
    expect(screen.queryByText(/最近整理/i)).toBeNull();
    expect(screen.queryByText(/展开说明/i)).toBeNull();
    expect(within(centerColumn).getByText('历史数据')).toBeInTheDocument();
    expect(within(rightRail).queryByText('历史数据')).toBeNull();
  });

  it('builds metadata from the indicator data', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'cpi' }) });

    expect(metadata.title).toBe('消费者价格指数（CPI） | Trader42 指标字典');
  });

  it('renders the payroll reading template for nonfarm payrolls', async () => {
    const indicator = await getIndicatorBySlug('nonfarm-payrolls');

    expect(indicator).toBeDefined();
    const { container } = render(<IndicatorPageView indicator={indicator!} />);
    const workspace = container.firstElementChild as HTMLElement;
    const centerColumn = workspace.children[1] as HTMLElement;

    expect(screen.getByRole('heading', { name: '非农就业人数（NFP）' })).toBeInTheDocument();
    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/数据截至：/i)).toBeInTheDocument();
    expect(screen.getByText(/页面整理：/i)).toBeInTheDocument();
    expect(screen.getByText(/发布时间节奏：/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.queryByText(/交易员先问它有没有超预期/i)).toBeNull();
    expect(screen.getAllByText('最新值').length).toBeGreaterThan(0);
    expect(screen.getAllByText('上期读数').length).toBeGreaterThan(0);
    expect(screen.getAllByText('18.7').length).toBeGreaterThan(0);
    expect(screen.getAllByText('万个岗位').length).toBeGreaterThan(0);
    expect(screen.getAllByText('25.6 万个岗位').length).toBeGreaterThan(0);
    expect(screen.getAllByText('历史位置').length).toBeGreaterThan(0);
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.queryByText(/为什么重要/i)).toBeNull();
    expect(screen.queryByText(/市场先看什么/i)).toBeNull();
    expect(screen.queryByText(/当前判断/i)).toBeNull();
    expect(screen.queryByText(/历史说明/i)).toBeNull();
    expect(screen.queryByText(/它还不能说明什么/i)).toBeNull();
    expect(within(centerColumn).getByText('历史数据')).toBeInTheDocument();
  });

  it('renders the policy reading template for the FOMC rate decision', async () => {
    const indicator = await getIndicatorBySlug('fomc-rate-decision');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: 'FOMC 利率决议' })).toBeInTheDocument();
    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/数据截至：/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新样本期：/i)).toBeNull();
    expect(screen.queryByText(/交易员先问它有没有超预期/i)).toBeNull();
    expect(screen.getByText(/目标区间/i)).toBeInTheDocument();
    expect(screen.getByText(/政策立场/i)).toBeInTheDocument();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.queryByText(/为什么重要/i)).toBeNull();
    expect(screen.queryByText(/市场先看什么/i)).toBeNull();
    expect(screen.queryByText(/当前判断/i)).toBeNull();
    expect(screen.queryByText(/历史说明/i)).toBeNull();
    expect(screen.getByText(/历史数据/i)).toBeInTheDocument();
  });

  it('renders the growth reading template for ISM PMI', async () => {
    const indicator = await getIndicatorBySlug('ism-pmi');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: 'ISM 制造业 PMI' })).toBeInTheDocument();
    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/数据截至：/i)).toBeInTheDocument();
    expect(screen.queryByText(/最新观测期：/i)).toBeNull();
    expect(screen.queryByText(/交易员先问它有没有超预期/i)).toBeNull();
    expect(screen.getByText(/较前值/i)).toBeInTheDocument();
    expect(screen.queryByText(/市场怎么读/i)).toBeNull();
    expect(screen.queryByText(/为什么重要/i)).toBeNull();
    expect(screen.queryByText(/市场先看什么/i)).toBeNull();
    expect(screen.queryByText(/当前判断/i)).toBeNull();
    expect(screen.queryByText(/历史说明/i)).toBeNull();
    expect(screen.getByText(/历史数据/i)).toBeInTheDocument();
  });

  it('renders a generic live page from metadata', async () => {
    const indicator = await getIndicatorBySlug('retail-sales');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '零售销售' })).toBeInTheDocument();
    expect(screen.getByText(/这个指标是什么/i)).toBeInTheDocument();
    expect(screen.queryByText(/市场先看什么/i)).toBeNull();
    expect(screen.getByText(/零售销售在回答一个简单问题/)).toBeInTheDocument();
    expect(screen.getByText(/关键读数/i).compareDocumentPosition(screen.getByText(/这个指标是什么/i)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/它直接关系到内需强不强/)).toBeNull();
    expect(screen.getByText(/关键读数/i)).toBeInTheDocument();
    expect(screen.getByText(/历史数据/i)).toBeInTheDocument();
  });

  it('renders core PCE as a live inflation page from metadata', async () => {
    const indicator = await getIndicatorBySlug('core-pce');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '核心 PCE' })).toBeInTheDocument();
    expect(screen.getByText(/更接近美联储真正盯着看的底层通胀/)).toBeInTheDocument();
  });

  it('renders JOLTS as a live labor page from metadata', async () => {
    const indicator = await getIndicatorBySlug('jolts-job-openings');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '职位空缺（JOLTS）' })).toBeInTheDocument();
    expect(screen.getByText(/岗位空缺越多/)).toBeInTheDocument();
  });

  it('renders S&P services PMI substitute as a live growth page from metadata', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('tradingeconomics.com')) {
        return {
          ok: true,
          text: async () => 'Services PMI in the United States decreased to 49.80 points in March from 51.70 points in February of 2026.',
        } as Response;
      }

      return {
        ok: true,
        text: async () => 'April 03 2026 13:45 UTC S&P Global US Services PMI View More',
      } as Response;
    });

    const indicator = await getIndicatorDataBySlug('ism-services-pmi', { fetchImpl: fetchImpl as typeof fetch });

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: 'S&P Global 美国服务业 PMI' })).toBeInTheDocument();
    expect(screen.getAllByText(/它和 ISM 服务业 PMI 高度相关/).length).toBeGreaterThan(0);
    expect(screen.getByText(/最新发布：2026-04-03/i)).toBeInTheDocument();
  });

  it('renders PPI as a live inflation page from metadata', async () => {
    const indicator = await getIndicatorBySlug('ppi');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '生产者价格指数（PPI）' })).toBeInTheDocument();
    expect(screen.getByText(/企业端的物价表/)).toBeInTheDocument();
  });

  it('renders initial jobless claims as a live labor page from metadata', async () => {
    const indicator = await getIndicatorBySlug('initial-jobless-claims');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '初请失业金人数' })).toBeInTheDocument();
    expect(screen.getByText(/这一周新出现了多少人开始申请失业救济/)).toBeInTheDocument();
  });

  it('renders Michigan consumer sentiment as a live generic page from metadata', async () => {
    const indicator = await getIndicatorBySlug('consumer-confidence');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '密歇根消费者信心' })).toBeInTheDocument();
    expect(screen.getByText(/密歇根消费者信心是在看美国家庭主观上怎么评价/)).toBeInTheDocument();
    expect(screen.getByText(/它常被拿来和零售销售、失业率、通胀预期一起看/)).toBeInTheDocument();
  });

  it('renders continuing jobless claims as a live labor page from metadata', async () => {
    const indicator = await getIndicatorBySlug('continuing-jobless-claims');

    expect(indicator).toBeDefined();
    render(<IndicatorPageView indicator={indicator!} />);

    expect(screen.getByRole('heading', { name: '持续领取失业金人数' })).toBeInTheDocument();
    expect(screen.getByText(/已经失业的人，找新工作的速度是不是在变慢/)).toBeInTheDocument();
  });
});
