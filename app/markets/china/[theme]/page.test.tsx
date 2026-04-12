import { render, screen } from '@testing-library/react';

import ChinaThemePage, { generateStaticParams } from './page';

describe('China market theme page', () => {
  it('generates static params for all four china themes', async () => {
    const params = await generateStaticParams();
    const slugs = params.map((p) => p.theme);

    expect(slugs).toContain('demand');
    expect(slugs).toContain('credit');
    expect(slugs).toContain('policy');
    expect(slugs).toContain('commodities');
    expect(slugs).toHaveLength(4);
  });

  it('renders the demand theme page', async () => {
    render(await ChinaThemePage({ params: Promise.resolve({ theme: 'demand' }) }));

    expect(screen.getByRole('heading', { name: '增长与内需' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-main-grid')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /中国官方制造业 PMI/ }).length).toBeGreaterThan(0);
  });

  it('renders the credit theme page', async () => {
    render(await ChinaThemePage({ params: Promise.resolve({ theme: 'credit' }) }));

    expect(screen.getByRole('heading', { name: '地产与信用脉冲' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /社会融资规模/ }).length).toBeGreaterThan(0);
  });

  it('renders the policy theme page', async () => {
    render(await ChinaThemePage({ params: Promise.resolve({ theme: 'policy' }) }));

    expect(screen.getByRole('heading', { name: '政策托底与汇率' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /一年期贷款市场报价利率/ }).length).toBeGreaterThan(0);
  });

  it('renders the commodities theme page', async () => {
    render(await ChinaThemePage({ params: Promise.resolve({ theme: 'commodities' }) }));

    expect(screen.getByRole('heading', { name: '商品需求与区域传导' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /中国进口总额/ }).length).toBeGreaterThan(0);
  });
});
