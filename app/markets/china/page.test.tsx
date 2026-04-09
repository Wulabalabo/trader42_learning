import { render, screen } from '@testing-library/react';

import ChinaMarketPage from './page';

describe('China market placeholder page', () => {
  it('shows the under construction placeholder', async () => {
    render(await ChinaMarketPage());

    expect(screen.getByRole('heading', { name: '中国市场' })).toBeInTheDocument();
    expect(screen.queryByText('China / Macro')).toBeNull();
    expect(screen.getByText(/正在施工/)).toBeInTheDocument();
    expect(screen.getByText(/中国市场会更关注增长、地产、政策托底、汇率与商品需求/)).toBeInTheDocument();
  });
});
