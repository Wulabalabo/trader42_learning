import { render, screen } from '@testing-library/react';

import JapanMarketPage from './page';

describe('Japan market placeholder page', () => {
  it('shows the under construction placeholder', async () => {
    render(await JapanMarketPage());

    expect(screen.getByRole('heading', { name: '日本市场' })).toBeInTheDocument();
    expect(screen.queryByText('Japan / Macro')).toBeNull();
    expect(screen.getByText(/正在施工/)).toBeInTheDocument();
    expect(screen.getByText(/日本市场会更关注日元、央行政策正常化、收益率曲线和全球套息交易/)).toBeInTheDocument();
  });
});
