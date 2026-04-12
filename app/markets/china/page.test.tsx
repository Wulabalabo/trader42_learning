import { render, screen } from '@testing-library/react';

import ChinaMarketPage from './page';

describe('China market page', () => {
  it('shows the real china market teaching page with all four theme links', async () => {
    render(await ChinaMarketPage());

    expect(screen.getByRole('heading', { name: '中国市场' })).toBeInTheDocument();
    expect(screen.queryByText(/正在施工/)).toBeNull();

    const demandLinks = screen.getAllByRole('link', { name: /增长与内需/ });
    const creditLinks = screen.getAllByRole('link', { name: /地产与信用脉冲/ });
    const policyLinks = screen.getAllByRole('link', { name: /政策托底与汇率/ });
    const commoditiesLinks = screen.getAllByRole('link', { name: /商品需求与区域传导/ });

    expect(demandLinks.some((l) => l.getAttribute('href') === '/markets/china/demand')).toBe(true);
    expect(creditLinks.some((l) => l.getAttribute('href') === '/markets/china/credit')).toBe(true);
    expect(policyLinks.some((l) => l.getAttribute('href') === '/markets/china/policy')).toBe(true);
    expect(commoditiesLinks.some((l) => l.getAttribute('href') === '/markets/china/commodities')).toBe(true);
  });
});
